import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PaymentService } from './payment.service';
import { CheckoutDto } from './dto/checkout.dto';
export declare class OrdersService {
    private prisma;
    private cartService;
    private paymentService;
    constructor(prisma: PrismaService, cartService: CartService, paymentService: PaymentService);
    checkout(userId: string, dto: CheckoutDto): Promise<any>;
    getMyOrders(userId: string): Promise<any[]>;
    getOrderById(userId: string, orderId: string, isAdmin?: boolean): Promise<any>;
    updateStatus(orderId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        totalAmount: number;
    }>;
    generateInvoice(order: any): string;
}
