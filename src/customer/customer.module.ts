import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from '@shared/prisma.service';

@Module({
  providers: [CustomerService, PrismaService],
  exports: [CustomerService],
})
export class CustomerModule {}
