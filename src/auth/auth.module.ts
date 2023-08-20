import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '@shared/prisma.service';
import { CustomerService } from '@app/customer/customer.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, CustomerService],
})
export class AuthModule {}
