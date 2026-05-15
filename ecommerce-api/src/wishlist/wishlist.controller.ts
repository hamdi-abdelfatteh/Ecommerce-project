import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  getWishlist(@CurrentUser() user: User) {
    return this.wishlistService.getWishlist(user.id);
  }

  @Post(':productId')
  add(@CurrentUser() user: User, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(user.id, productId);
  }

  @Delete(':productId')
  remove(@CurrentUser() user: User, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(user.id, productId);
  }
}
