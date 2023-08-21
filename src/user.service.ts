import { Customer, Driver } from '@prisma/client';
import { CustomerService } from './customer/customer.service';
import { DriverService } from './driver/driver.service';
import { ProfileUpdateDto } from './profile/dto/profile-update.dto';

export class UserService {
  constructor(
    private customerService: CustomerService,
    private driverService: DriverService,
  ) {}

  async findById(id: string): Promise<Driver | Customer | null> {
    return (
      (await this.customerService.findById(id)) ??
      (await this.driverService.findById(id))
    );
  }

  async updateById(
    id: string,
    user_type: 'driver' | 'customer',
    data: ProfileUpdateDto,
  ): Promise<Driver | Customer | null> {
    let updatedUser: Driver | Customer = null;

    if (user_type === 'customer') {
      updatedUser = await this.customerService.updateById(id, data);
    } else {
      updatedUser = await this.driverService.updateById(id, data);
    }

    return updatedUser;
  }
}
