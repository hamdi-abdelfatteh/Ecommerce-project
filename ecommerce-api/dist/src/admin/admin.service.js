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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const orders_service_1 = require("../orders/orders.service");
let AdminService = class AdminService {
    prisma;
    ordersService;
    constructor(prisma, ordersService) {
        this.prisma = prisma;
        this.ordersService = ordersService;
    }
    async getDashboard() {
        const [totalUsers, totalOrders, totalProducts, revenueResult, recentOrders] = await Promise.all([
            this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
            this.prisma.order.count(),
            this.prisma.product.count(),
            this.prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { totalAmount: true } }),
            this.prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { firstName: true, lastName: true, email: true } } },
            }),
        ]);
        return {
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: Number(revenueResult._sum.totalAmount ?? 0),
            recentOrders,
        };
    }
    getAllOrders() {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                items: { include: { product: { select: { name: true } } } },
                payment: true,
            },
        });
    }
    updateOrderStatus(orderId, dto) {
        return this.ordersService.updateStatus(orderId, dto.status);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_service_1.OrdersService])
], AdminService);
//# sourceMappingURL=admin.service.js.map