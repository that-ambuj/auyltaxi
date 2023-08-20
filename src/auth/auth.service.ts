import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { CustomerService } from '@app/customer/customer.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private customerService: CustomerService,
  ) {}

  async generateOtp() {}

  async verifyOtp() {}
}
