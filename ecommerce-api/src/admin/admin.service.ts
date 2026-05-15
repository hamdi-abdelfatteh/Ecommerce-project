import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  async getDashboard() {
    const [totalUsers, totalOrders, totalProducts, revenueResult, recentOrders] = await Promise.all([
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { totalAmount: true } }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      }),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: Number(revenueResult._sum.totalAmount ?? 0),
      recentOrders,
    };
  }

  getAllOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
        payment: true,
      },
    });
  }

  updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(orderId, dto.status);
  }
}
