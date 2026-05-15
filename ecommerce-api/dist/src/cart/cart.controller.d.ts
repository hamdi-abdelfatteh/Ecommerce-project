import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart-item.dto';
import type { User } from '@prisma/client';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(user: User): Promise<any[]>;
    addItem(user: User, dto: AddToCartDto): Promise<any>;
    updateItem(user: User, productId: string, dto: UpdateCartItemDto): Promise<any>;
    removeItem(user: User, productId: string): Promise<{
        id: string;
        userId: string;
        productId: string;
        quantity: number;
    }>;
}
