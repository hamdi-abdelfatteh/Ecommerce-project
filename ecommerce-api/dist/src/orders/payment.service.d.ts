export type PaymentResult = {
    success: boolean;
    status: 'SUCCESS' | 'FAILED';
};
export declare class PaymentService {
    processPayment(cardNumber: string): PaymentResult;
}
