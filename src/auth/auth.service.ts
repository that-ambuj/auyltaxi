import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomerService } from '@app/customer/customer.service';

import { DriverService } from '@app/driver/driver.service';
import { OtpService } from '@app/otp.service';
import { SignInDto } from './dto/signup.dto';
import { Customer, Driver } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private driverService: DriverService,
    private otpService: OtpService,
  ) {}

  async signInWithOtp(userInfo: SignInDto) {
    let user: Driver | Customer;

    if (userInfo.user_type === 'customer') {
      user =
        (await this.customerService.findOneByNumber(userInfo.phone_number)) ??
        (await this.customerService.createUser(userInfo));
    } else {
      user =
        (await this.driverService.findOneByNumber(userInfo.phone_number)) ??
        (await this.driverService.createUser(userInfo));
    }

    return await this.sendOtp(user.id, userInfo.user_type);
  }

  async sendOtp(
    user_id: string,
    user_type: 'customer' | 'driver',
  ): Promise<string> {
    const new_otp = this.otpService.generateOtp();

    let otp: string;

    if (user_type === 'customer') {
      otp = await this.customerService.sendOtp(user_id, new_otp);
    } else {
      otp = await this.driverService.sendOtp(user_id, new_otp);
    }

    return otp;
  }

  async verifyOtp(otp: string): Promise<Driver | Customer> {
    const user =
      (await this.customerService.findByOtp(otp)) ??
      (await this.driverService.findByOtp(otp));

    if (!user) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST, {
        cause: 'User not found',
      });
    }

    return user;
  }
}
