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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReview(userId, productId, dto) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const existing = await this.prisma.review.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (existing)
            throw new common_1.ConflictException('You already reviewed this product');
        return this.prisma.review.create({
            data: { ...dto, userId, productId },
            include: { user: { select: { firstName: true, lastName: true } } },
        });
    }
    getProductReviews(productId) {
        return this.prisma.review.findMany({
            where: { productId },
            include: { user: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteReview(userId, reviewId) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        if (review.userId !== userId)
            throw new common_1.NotFoundException('Review not found');
        return this.prisma.review.delete({ where: { id: reviewId } });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map