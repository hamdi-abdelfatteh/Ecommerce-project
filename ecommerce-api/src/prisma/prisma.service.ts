import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  get user() { return this.client.user; }
  get address() { return this.client.address; }
  get category() { return this.client.category; }
  get product() { return this.client.product; }
  get cartItem() { return this.client.cartItem; }
  get wishlist() { return this.client.wishlist; }
  get review() { return this.client.review; }
  get order() { return this.client.order; }
  get orderItem() { return this.client.orderItem; }
  get payment() { return this.client.payment; }

  $transaction(...args: any[]): any {
    return (this.client.$transaction as any)(...args);
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
