import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomerService } from '@app/customer/customer.service';
import { DriverService } from '@app/driver/driver.service';
import { OtpService } from '@app/otp.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CustomerService, DriverService, OtpService],
})
export class AuthModule {}
