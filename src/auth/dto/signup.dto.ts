import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';

enum UserType {
  Customer = 'customer',
  Driver = 'driver',
}

/**
 * Object required to create a new account
 */
export class SignInDto {
  /**
   * @example "+7 9876543219"
   */
  @IsPhoneNumber('KZ')
  @IsNotEmpty()
  phone_number: string;

  /**
   * @example "John Doe"
   */
  @IsAlpha()
  name?: string;

  @ApiProperty({ enum: UserType, isArray: false })
  @IsEnum(UserType)
  user_type: UserType;
}
