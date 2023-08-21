import { OtpService } from '@app/otp.service';
import { ProfileUpdateDto } from '@app/profile/dto/profile-update.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Just a dummy for now
   */
  async sendOtp(customer_id: string, otp: string): Promise<string> {
    await this.prisma.customerPhoneToken.deleteMany({ where: { customer_id } });

    // TODO: send otp via SMS service provider like AWS SNS
    const token = await this.prisma.customerPhoneToken.create({
      data: {
        customer_id,
        otp,
      },
    });

    return token.otp;
  }

  async findOneByNumber(phone_number: string): Promise<Customer | undefined> {
    return this.prisma.customer.findUnique({ where: { phone_number } });
  }

  async findByOtp(otp: string): Promise<Customer | undefined> {
    const token = await this.prisma.customerPhoneToken.findFirst({
      where: { otp },
      orderBy: { created_at: 'desc' },
    });

    if (!token) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.customer.findUnique({
      where: { id: token.customer_id },
    });
  }

  async findById(id: string): Promise<Customer | undefined> {
    return this.prisma.customer.findUnique({ where: { id } });
  }

  async createUser({
    phone_number,
    name,
  }: {
    phone_number: string;
    name?: string;
  }): Promise<Customer> {
    return this.prisma.customer.create({
      data: { phone_number, name },
    });
  }

  async updateById(id: string, data: ProfileUpdateDto) {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }
}
