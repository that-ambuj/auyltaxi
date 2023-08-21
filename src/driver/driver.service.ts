import { OtpService } from '@app/otp.service';
import { ProfileUpdateDto } from '@app/profile/dto/profile-update.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Driver } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) {}

  async sendOtp(driver_id: string, new_otp: string): Promise<string> {
    // Cleanup all old OTP token
    await this.prisma.driverPhoneToken.deleteMany({ where: { driver_id } });

    const token = await this.prisma.driverPhoneToken.create({
      data: {
        driver_id,
        otp: new_otp,
      },
    });

    return token.otp;
  }

  async findOneByNumber(phone_number: string): Promise<Driver | undefined> {
    return this.prisma.driver.findUnique({ where: { phone_number } });
  }

  async findByOtp(otp: string): Promise<Driver | undefined> {
    const token = await this.prisma.driverPhoneToken.findFirst({
      where: { otp },
      orderBy: { created_at: 'desc' },
    });

    if (!token) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.driver.findUnique({
      where: { id: token.driver_id },
    });
  }

  async findById(id: string): Promise<Driver | undefined> {
    return this.prisma.driver.findUnique({ where: { id } });
  }

  async createUser({
    phone_number,
    name,
  }: {
    phone_number: string;
    name?: string;
  }): Promise<Driver> {
    return this.prisma.driver.create({
      data: { phone_number, name },
    });
  }

  async updateById(id: string, data: ProfileUpdateDto) {
    return this.prisma.driver.update({
      where: { id },
      data,
    });
  }
}
