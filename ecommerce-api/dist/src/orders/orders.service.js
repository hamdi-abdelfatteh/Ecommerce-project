"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cart_service_1 = require("../cart/cart.service");
const payment_service_1 = require("./payment.service");
function parseImages(images) {
    if (typeof images === 'string') {
        try {
            return JSON.parse(images);
        }
        catch {
            return [];
        }
    }
    return images || [];
}
function normalizeOrder(order) {
    return {
        ...order,
        items: order.items.map((item) => ({
            ...item,
            product: { ...item.product, images: parseImages(item.product.images) },
        })),
    };
}
let OrdersService = class OrdersService {
    prisma;
    cartService;
    paymentService;
    constructor(prisma, cartService, paymentService) {
        this.prisma = prisma;
        this.cartService = cartService;
        this.paymentService = paymentService;
    }
    async checkout(userId, dto) {
        const cartItems = await this.cartService.getCart(userId);
        if (cartItems.length === 0)
            throw new common_1.BadRequestException('Cart is empty');
        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + Number(item.product.price) * item.quantity;
        }, 0);
        const paymentResult = this.paymentService.processPayment(dto.cardNumber);
        const order = await this.prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: paymentResult.success ? 'PAID' : 'PENDING',
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.product.price,
                    })),
                },
                payment: {
                    create: {
                        status: paymentResult.status,
                        cardLast4: dto.cardNumber,
                    },
                },
            },
            include: { items: { include: { product: true } }, payment: true },
        });
        if (paymentResult.success) {
            await this.cartService.clearCart(userId);
            return normalizeOrder(order);
        }
        throw new common_1.BadRequestException({ message: 'Payment failed', order: normalizeOrder(order) });
    }
    async getMyOrders(userId) {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: { select: { name: true, images: true } } } }, payment: true },
            orderBy: { createdAt: 'desc' },
        });
        return orders.map(normalizeOrder);
    }
    async getOrderById(userId, orderId, isAdmin = false) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { product: { select: { name: true, images: true, brand: true } } } },
                payment: true,
                user: { select: { firstName: true, lastName: true, email: true } },
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (!isAdmin && order.userId !== userId)
            throw new common_1.ForbiddenException();
        return normalizeOrder(order);
    }
    async updateStatus(orderId, status) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.prisma.order.update({ where: { id: orderId }, data: { status: status } });
    }
    generateInvoice(order) {
        const lines = [
            '========================================',
            `INVOICE - Order #${order.id}`,
            `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
            `Status: ${order.status}`,
            '----------------------------------------',
            `Customer: ${order.user?.firstName ?? ''} ${order.user?.lastName ?? ''}`,
            `Email: ${order.user?.email ?? ''}`,
            '----------------------------------------',
            'Items:',
        ];
        for (const item of order.items) {
            lines.push(`  ${item.product.name} x${item.quantity}  $${Number(item.unitPrice).toFixed(2)}`);
        }
        lines.push('----------------------------------------');
        lines.push(`TOTAL: $${Number(order.totalAmount).toFixed(2)}`);
        lines.push(`Payment: ${order.payment?.status ?? 'N/A'}`);
        lines.push('========================================');
        return lines.join('\n');
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cart_service_1.CartService,
        payment_service_1.PaymentService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map