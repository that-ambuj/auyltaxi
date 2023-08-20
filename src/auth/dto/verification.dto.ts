import { IsString } from 'class-validator';

export class VerificationDto {
  @IsString()
  otp: string;
}
