import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PaymentService } from './payment.service';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CartModule],
  providers: [OrdersService, PaymentService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
