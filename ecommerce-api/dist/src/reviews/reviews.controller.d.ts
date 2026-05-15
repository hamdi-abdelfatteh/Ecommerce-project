import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import type { User } from '@prisma/client';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    getReviews(productId: string): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string | null;
    })[]>;
    createReview(user: User, productId: string, dto: CreateReviewDto): Promise<{
        user: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string | null;
    }>;
    deleteReview(user: User, reviewId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string | null;
    }>;
}
