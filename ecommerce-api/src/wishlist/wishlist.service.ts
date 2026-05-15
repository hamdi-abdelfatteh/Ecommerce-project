import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

function normalizeWishlistItem(item: any) {
  return { ...item, product: { ...item.product, images: parseImages(item.product.images) } };
}

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const items = await this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: { select: { id: true, name: true, price: true, images: true, brand: true } } },
    });
    return items.map(normalizeWishlistItem);
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) throw new ConflictException('Product already in wishlist');

    const result = await this.prisma.wishlist.create({
      data: { userId, productId },
      include: { product: { select: { id: true, name: true, price: true, images: true } } },
    });
    return normalizeWishlistItem(result);
  }

  async removeFromWishlist(userId: string, productId: string) {
    const item = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new NotFoundException('Product not in wishlist');
    return this.prisma.wishlist.delete({ where: { userId_productId: { userId, productId } } });
  }
}
