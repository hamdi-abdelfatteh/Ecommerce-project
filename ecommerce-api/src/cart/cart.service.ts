import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart-item.dto';

const PRODUCT_INCLUDE = { product: { select: { id: true, name: true, price: true, images: true, stock: true } } };

function parseImages(images: any): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeCartItem(item: any) {
  if (!item || !item.product) return item;
  return { ...item, product: { ...item.product, images: parseImages(item.product.images) } };
}

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({ where: { userId }, include: PRODUCT_INCLUDE });
    return cartItems.map(normalizeCartItem);
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const result = await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId: dto.productId } },
      update: { quantity: { increment: dto.quantity } },
      create: { userId, productId: dto.productId, quantity: dto.quantity },
      include: PRODUCT_INCLUDE,
    });
    return normalizeCartItem(result);
  }

  async updateItem(userId: string, productId: string, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    const result = await this.prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: dto.quantity },
      include: PRODUCT_INCLUDE,
    });
    return normalizeCartItem(result);
  }

  async removeItem(userId: string, productId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    return this.prisma.cartItem.delete({ where: { userId_productId: { userId, productId } } });
  }

  clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({ where: { userId } });
  }
}
