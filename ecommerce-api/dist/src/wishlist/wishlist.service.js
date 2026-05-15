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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
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
function normalizeWishlistItem(item) {
    return { ...item, product: { ...item.product, images: parseImages(item.product.images) } };
}
let WishlistService = class WishlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWishlist(userId) {
        const items = await this.prisma.wishlist.findMany({
            where: { userId },
            include: { product: { select: { id: true, name: true, price: true, images: true, brand: true } } },
        });
        return items.map(normalizeWishlistItem);
    }
    async addToWishlist(userId, productId) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const existing = await this.prisma.wishlist.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (existing)
            throw new common_1.ConflictException('Product already in wishlist');
        const result = await this.prisma.wishlist.create({
            data: { userId, productId },
            include: { product: { select: { id: true, name: true, price: true, images: true } } },
        });
        return normalizeWishlistItem(result);
    }
    async removeFromWishlist(userId, productId) {
        const item = await this.prisma.wishlist.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (!item)
            throw new common_1.NotFoundException('Product not in wishlist');
        return this.prisma.wishlist.delete({ where: { userId_productId: { userId, productId } } });
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map