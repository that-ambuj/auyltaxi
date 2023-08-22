import { UserService } from "@app/user.service";
import { Injectable } from "@nestjs/common";
import { Customer, Driver } from "@prisma/client";
import { ProfileUpdateDto } from "./dto/profile-update.dto";
import { DriverService } from "@app/driver/driver.service";
import { CustomerService } from "@app/customer/customer.service";

type UserType = {
  user_type: "customer" | "driver";
};

@Injectable()
export class ProfileService {
  constructor(
    private userService: UserService,
    private driverService: DriverService,
    private customerService: CustomerService,
  ) {}

  async findById(
    id: string,
  ): Promise<(Driver & UserType) | (Customer & UserType) | null> {
    let user: Driver | Customer;

    user = await this.customerService.findById(id);
    if (user) {
      return { ...user, user_type: "customer" };
    }

    user = await this.driverService.findById(id);
    if (user) {
      return { ...user, user_type: "driver" };
    }

    return null;
  }

  async update(user_id: string, data: ProfileUpdateDto) {
    const user = await this.findById(user_id);

    if (!user) {
      return null;
    }

    const updated =
      user.user_type == "customer"
        ? this.customerService.updateById(user.id, data)
        : this.driverService.updateById(user.id, data);

    return updated;
  }
}
