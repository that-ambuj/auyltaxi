import { IsPhoneNumber } from 'class-validator';

enum UserType {
  Customer = 'customer',
  Driver = 'driver',
}

/**
 * Used for both signup and signin
 */
export class SignInDto {
  @IsPhoneNumber('KZ')
  phone_number: string;
  name?: string;
  user_type: UserType;
}
