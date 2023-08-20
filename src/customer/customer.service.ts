import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';

import { customAlphabet } from 'nanoid';

@Injectable()
export class CustomerService {
  rng: () => string;

  constructor(private prisma: PrismaService) {
    this.rng = customAlphabet('1234567890', 6);
  }

  async findOneByNumber(phone_number: string): Promise<Customer | undefined> {
    return this.prisma.customer.findUnique({ where: { phone_number } });
  }

  /**
   * Just a dummy for now
   */
  async sendOtp(customer_id: string) {
    await this.generateOtp(customer_id);
  }

  private async generateOtp(customer_id: string): Promise<string> {
    const otp = this.rng();

    await this.prisma.customerPhoneToken.deleteMany({ where: { customer_id } });

    await this.prisma.customerPhoneToken.create({
      data: {
        customer_id,
        otp,
      },
    });

    return otp;
  }

  async findUserByOtp(otp: string): Promise<Customer | undefined> {
    const token = await this.prisma.customerPhoneToken.findFirst({
      where: { otp },
      orderBy: { created_at: 'desc' },
    });

    return this.prisma.customer.findUnique({
      where: { id: token.customer_id },
    });
  }

  async createUser(phone_number: string, name?: string): Promise<Customer> {
    return this.prisma.customer.create({
      data: { phone_number, name },
    });
  }
}
