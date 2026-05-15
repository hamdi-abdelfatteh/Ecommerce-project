import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<any[]>;
    addToWishlist(userId: string, productId: string): Promise<any>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        id: string;
        userId: string;
        productId: string;
    }>;
}
