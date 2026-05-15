import { Injectable } from '@nestjs/common';

export type PaymentResult = { success: boolean; status: 'SUCCESS' | 'FAILED' };

@Injectable()
export class PaymentService {
  processPayment(cardNumber: string): PaymentResult {
    if (cardNumber === '1234') {
      return { success: true, status: 'SUCCESS' };
    }
    return { success: false, status: 'FAILED' };
  }
}
