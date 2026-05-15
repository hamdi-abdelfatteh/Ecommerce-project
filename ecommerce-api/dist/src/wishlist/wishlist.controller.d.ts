import { WishlistService } from './wishlist.service';
import type { User } from '@prisma/client';
export declare class WishlistController {
    private wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(user: User): Promise<any[]>;
    add(user: User, productId: string): Promise<any>;
    remove(user: User, productId: string): Promise<{
        id: string;
        userId: string;
        productId: string;
    }>;
}
