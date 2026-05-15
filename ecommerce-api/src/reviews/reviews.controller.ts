import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  getReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createReview(
    @CurrentUser() user: User,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(user.id, productId, dto);
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  deleteReview(@CurrentUser() user: User, @Param('reviewId') reviewId: string) {
    return this.reviewsService.deleteReview(user.id, reviewId);
  }
}
