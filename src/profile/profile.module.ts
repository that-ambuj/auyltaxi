import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { DriverService } from "@app/driver/driver.service";
import { CustomerService } from "@app/customer/customer.service";
import { OtpService } from "@app/otp.service";

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, DriverService, CustomerService, OtpService],
})
export class ProfileModule {}
