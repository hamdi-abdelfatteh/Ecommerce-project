import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart-item.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<any[]>;
    addItem(userId: string, dto: AddToCartDto): Promise<any>;
    updateItem(userId: string, productId: string, dto: UpdateCartItemDto): Promise<any>;
    removeItem(userId: string, productId: string): Promise<{
        id: string;
        userId: string;
        productId: string;
        quantity: number;
    }>;
    clearCart(userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
