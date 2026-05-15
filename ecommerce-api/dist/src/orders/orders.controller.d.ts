import { Response } from 'express';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import type { User } from '@prisma/client';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    checkout(user: User, dto: CheckoutDto): Promise<any>;
    getMyOrders(user: User): Promise<any[]>;
    getOrder(user: User, id: string): Promise<any>;
    getInvoice(user: User, id: string, res: Response): Promise<void>;
    getAllOrders(): Promise<any[]>;
}
