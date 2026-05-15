import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: User) {
    return this.cartService.getCart(user.id);
  }

  @Post()
  addItem(@CurrentUser() user: User, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(user.id, dto);
  }

  @Patch(':productId')
  updateItem(@CurrentUser() user: User, @Param('productId') productId: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(user.id, productId, dto);
  }

  @Delete(':productId')
  removeItem(@CurrentUser() user: User, @Param('productId') productId: string) {
    return this.cartService.removeItem(user.id, productId);
  }
}
