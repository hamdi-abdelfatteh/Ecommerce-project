import { AdminService } from './admin.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
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
    updateOrderStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        totalAmount: number;
    }>;
}
