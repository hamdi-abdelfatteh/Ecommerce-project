import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class AdminService {
    private prisma;
    private ordersService;
    constructor(prisma: PrismaService, ordersService: OrdersService);
    getDashboard(): Promise<{
        totalUsers: number;
        totalOrders: number;
        totalProducts: number;
        totalRevenue: number;
        recentOrders: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            totalAmount: number;
        })[];
    }>;
    getAllOrders(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
        payment: {
            id: string;
            createdAt: Date;
            status: string;
            cardLast4: string | null;
            orderId: string;
        } | null;
        items: ({
            product: {
                name: string;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            unitPrice: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        totalAmount: number;
    })[]>;
    updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        totalAmount: number;
    }>;
}
