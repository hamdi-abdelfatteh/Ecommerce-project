import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto, SortOrder } from './dto/query-product.dto';

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

function normalizeProduct(product: any) {
  return { ...product, images: parseImages(product.images) };
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProductDto) {
    const data = { ...dto, images: dto.images ? JSON.stringify(dto.images) : '[]' };
    return this.prisma.product.create({ data, include: { category: true } }).then(normalizeProduct);
  }

  private normalizeProduct(product: any) {
    if (!product) return product;
    return {
      ...product,
      images: (() => {
        try {
          if (typeof product.images === 'string') return JSON.parse(product.images);
          return product.images || [];
        } catch {
          return [];
        }
      })(),
    };
  }

  findAll(query: QueryProductDto) {
    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }
    if (query.brand) where.brand = { equals: query.brand };
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sort === SortOrder.PRICE_ASC) orderBy = { price: 'asc' };
    else if (query.sort === SortOrder.PRICE_DESC) orderBy = { price: 'desc' };
    else if (query.sort === SortOrder.NEWEST) orderBy = { createdAt: 'desc' };

    return this.prisma.product.findMany({ where, orderBy, include: { category: true } }).then((products) => products.map((p) => this.normalizeProduct(p)));
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.normalizeProduct(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.images) data.images = JSON.stringify(dto.images);
    if (dto.categoryId === undefined) delete data.categoryId;
    return this.prisma.product.update({ where: { id }, data, include: { category: true } }).then(normalizeProduct);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
