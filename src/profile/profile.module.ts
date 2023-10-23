import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { CustomerService } from "@app/customer/customer.service";
import { OtpService } from "@app/otp.service";
import { DriverService } from "@app/driver/driver.service";
import { DriverModule } from "@app/driver/driver.module";

@Module({
  imports: [DriverModule],
  controllers: [ProfileController],
  providers: [ProfileService, DriverService, CustomerService, OtpService],
})
export class ProfileModule {}
