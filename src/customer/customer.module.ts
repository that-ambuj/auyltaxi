import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { OtpService } from '@app/otp.service';
import { PrismaService } from '@shared/prisma.service';

@Module({
  providers: [CustomerService, PrismaService, OtpService],
  exports: [CustomerService],
})
export class CustomerModule {}
