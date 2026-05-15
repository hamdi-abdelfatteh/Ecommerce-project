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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PRODUCT_INCLUDE = { product: { select: { id: true, name: true, price: true, images: true, stock: true } } };
function parseImages(images) {
    if (!images)
        return [];
    if (Array.isArray(images))
        return images;
    if (typeof images === 'string') {
        try {
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return [];
        }
    }
    return [];
}
function normalizeCartItem(item) {
    if (!item || !item.product)
        return item;
    return { ...item, product: { ...item.product, images: parseImages(item.product.images) } };
}
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        const cartItems = await this.prisma.cartItem.findMany({ where: { userId }, include: PRODUCT_INCLUDE });
        return cartItems.map(normalizeCartItem);
    }
    async addItem(userId, dto) {
        const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const result = await this.prisma.cartItem.upsert({
            where: { userId_productId: { userId, productId: dto.productId } },
            update: { quantity: { increment: dto.quantity } },
            create: { userId, productId: dto.productId, quantity: dto.quantity },
            include: PRODUCT_INCLUDE,
        });
        return normalizeCartItem(result);
    }
    async updateItem(userId, productId, dto) {
        const item = await this.prisma.cartItem.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        const result = await this.prisma.cartItem.update({
            where: { userId_productId: { userId, productId } },
            data: { quantity: dto.quantity },
            include: PRODUCT_INCLUDE,
        });
        return normalizeCartItem(result);
    }
    async removeItem(userId, productId) {
        const item = await this.prisma.cartItem.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        return this.prisma.cartItem.delete({ where: { userId_productId: { userId, productId } } });
    }
    clearCart(userId) {
        return this.prisma.cartItem.deleteMany({ where: { userId } });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map