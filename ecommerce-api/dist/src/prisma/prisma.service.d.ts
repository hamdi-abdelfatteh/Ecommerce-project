import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    private readonly client;
    constructor();
    get user(): import(".prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get address(): import(".prisma/client").Prisma.AddressDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get category(): import(".prisma/client").Prisma.CategoryDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get product(): import(".prisma/client").Prisma.ProductDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get cartItem(): import(".prisma/client").Prisma.CartItemDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get wishlist(): import(".prisma/client").Prisma.WishlistDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get review(): import(".prisma/client").Prisma.ReviewDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get order(): import(".prisma/client").Prisma.OrderDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get orderItem(): import(".prisma/client").Prisma.OrderItemDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get payment(): import(".prisma/client").Prisma.PaymentDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    $transaction(...args: any[]): any;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
