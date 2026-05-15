import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    createReview(userId: string, productId: string, dto: CreateReviewDto): Promise<{
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
    getProductReviews(productId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    deleteReview(userId: string, reviewId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string | null;
    }>;
}
