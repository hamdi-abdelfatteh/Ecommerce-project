import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, productId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) throw new ConflictException('You already reviewed this product');

    return this.prisma.review.create({
      data: { ...dto, userId, productId },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
  }

  getProductReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteReview(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId) throw new NotFoundException('Review not found');
    return this.prisma.review.delete({ where: { id: reviewId } });
  }
}
