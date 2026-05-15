import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  shippingAddressId: string;
}
