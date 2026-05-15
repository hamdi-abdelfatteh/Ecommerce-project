import { Controller, Post, Get, Param, Body, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@CurrentUser() user: User, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(user.id, dto);
  }

  @Get()
  getMyOrders(@CurrentUser() user: User) {
    return this.ordersService.getMyOrders(user.id);
  }

  @Get(':id')
  getOrder(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.getOrderById(user.id, id);
  }

  @Get(':id/invoice')
  async getInvoice(@CurrentUser() user: User, @Param('id') id: string, @Res() res: Response) {
    const order = await this.ordersService.getOrderById(user.id, id);
    const invoice = this.ordersService.generateInvoice(order);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${id}.txt"`);
    res.send(invoice);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getAllOrders() {
    return this.ordersService.getMyOrders('');
  }
}
