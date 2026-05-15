import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PaymentService } from './payment.service';
import { CheckoutDto } from './dto/checkout.dto';

function parseImages(images: string | unknown[]) {
  if (typeof images === 'string') {
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  }
  return images || [];
}

function normalizeOrder(order: any) {
  return {
    ...order,
    items: order.items.map((item: any) => ({
      ...item,
      product: { ...item.product, images: parseImages(item.product.images) },
    })),
  };
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private paymentService: PaymentService,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const cartItems = await this.cartService.getCart(userId);
    if (cartItems.length === 0) throw new BadRequestException('Cart is empty');

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const paymentResult = this.paymentService.processPayment(dto.cardNumber);

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: paymentResult.success ? 'PAID' : 'PENDING',
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
        payment: {
          create: {
            status: paymentResult.status,
            cardLast4: dto.cardNumber,
          },
        },
      },
      include: { items: { include: { product: true } }, payment: true },
    });

    if (paymentResult.success) {
      await this.cartService.clearCart(userId);
      return normalizeOrder(order);
    }

    throw new BadRequestException({ message: 'Payment failed', order: normalizeOrder(order) });
  }

  async getMyOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: { select: { name: true, images: true } } } }, payment: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(normalizeOrder);
  }

  async getOrderById(userId: string, orderId: string, isAdmin = false) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { select: { name: true, images: true, brand: true } } } },
        payment: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (!isAdmin && order.userId !== userId) throw new ForbiddenException();
    return normalizeOrder(order);
  }

  async updateStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    return this.prisma.order.update({ where: { id: orderId }, data: { status: status as any } });
  }

  generateInvoice(order: any) {
    const lines: string[] = [
      '========================================',
      `INVOICE - Order #${order.id}`,
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      `Status: ${order.status}`,
      '----------------------------------------',
      `Customer: ${order.user?.firstName ?? ''} ${order.user?.lastName ?? ''}`,
      `Email: ${order.user?.email ?? ''}`,
      '----------------------------------------',
      'Items:',
    ];

    for (const item of order.items) {
      lines.push(`  ${item.product.name} x${item.quantity}  $${Number(item.unitPrice).toFixed(2)}`);
    }

    lines.push('----------------------------------------');
    lines.push(`TOTAL: $${Number(order.totalAmount).toFixed(2)}`);
    lines.push(`Payment: ${order.payment?.status ?? 'N/A'}`);
    lines.push('========================================');

    return lines.join('\n');
  }
}
