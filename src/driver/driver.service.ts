import { ProfileUpdateDto } from "@app/profile/dto/profile-update.dto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Driver, Ride } from "@prisma/client";
import { PrismaService } from "@shared/prisma.service";
import { RideStatusForHistory } from "./dto/get-rides-history.dto";

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) { }

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

  async findByOtp(otp: string): Promise<Driver | null> {
    const token = await this.prisma.driverPhoneToken.findFirst({
      where: { otp },
      orderBy: { created_at: "desc" },
    });

    if (!token) {
      return null;
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
    const info = {
      model: data.car_model,
      brand: data.car_brand,
      license_number: data.car_number,
    };

    return this.prisma.driver.update({
      where: { id },
      data: {
        name: data.name,
        car: {
          upsert: {
            where: { driver_id: id },
            create: info,
            update: info,
          },
        },
      },
    });
  }

  async updateLocation({
    id,
    lat,
    long,
  }: {
    id: string;
    lat: number;
    long: number;
  }) {
    return this.prisma.driver.update({
      where: { id },
      data: { last_lat: lat, last_long: long },
      select: { id: true, last_lat: true, last_long: true },
    });
  }

  async getLocation({ id }: { id: string }) {
    return this.prisma.driver.findUnique({
      where: { id },
      select: { id: true, last_long: true, last_lat: true },
    });
  }

  async findRides({ take, skip }: { take: number; skip: number }) {
    return this.prisma.ride.findMany({
      where: { status: "SEARCHING" },
      orderBy: { created_at: "asc" },
      skip,
      take,
    });
  }

  async findRidesByDriverId({
    driver_id,
    take,
    status,
    skip,
  }: {
    driver_id: string;
    status: RideStatusForHistory | RideStatusForHistory[];
    take: number;
    skip: number;
  }) {
    if (Array.isArray(status)) {
      const status_arr = status.map((s) => ({ status: s }))

      return this.prisma.ride.findMany({
        where: { driver_id, OR: status_arr },
        orderBy: { updated_at: "desc" },
        include: { requested_by: true },
        skip,
        take
      })
    }

    return this.prisma.ride.findMany({
      where: { driver_id, status },
      orderBy: { updated_at: "desc" },
      include: { requested_by: true },
      skip,
      take,
    });
  }

  async findRideByDriverId({
    driver_id,
    id,
  }: {
    driver_id: string;
    id: string;
  }) {
    return this.prisma.ride.findUnique({ where: { id, driver_id }, include: { requested_by: true } });
  }

  async markFinished({ id, driver_id }: { id: string; driver_id: string }) {
    // TODO: check that the driver's last location is within 50m-100m
    // of the drop location
    const ride = await this.prisma.ride.update({
      where: { id, driver_id, status: "BOOKED" },
      data: { status: "FINISHED" },
    });

    if (!ride) {
      return null;
    }

    // Update driver's balance
    await this.prisma.driver.update({
      where: { id: driver_id },
      data: { balance: { increment: ride.confirmed_fare } },
    });

    return ride;
  }

  async getNearbyRides({
    id,
    take = 10,
    skip,
    cursor,
    max_distance = 1,
  }: {
    id: string;
    take?: number;
    skip?: number;
    cursor?: Date;
    max_distance?: number;
  }) {
    const { last_lat, last_long } = await this.getLocation({ id });

    if (!last_lat || !last_long) {
      throw new BadRequestException(
        "Please update driver's location at least once before looking for nearby rides.",
      );
    }

    const orig = { lat: last_lat.toNumber(), long: last_long.toNumber() };

    let rides: Ride[];

    if (!cursor) {
      rides = await this.prisma.ride.findMany({
        where: { status: "SEARCHING" },
        orderBy: { created_at: "asc" },
        skip,
        take,
      });
    } else {
      rides = await this.prisma.ride.findMany({
        where: { status: "SEARCHING" },
        orderBy: { created_at: "asc" },
        cursor: { created_at: cursor },
        skip: 1,
        take,
      });
    }

    const results = rides.filter(({ pickup_lat, pickup_long }) => {
      const distance = haversineDistance({
        orig,
        dest: { lat: pickup_lat.toNumber(), long: pickup_long.toNumber() },
      });

      return distance <= max_distance;
    });

    return results;
  }
}

function haversineDistance({
  orig,
  dest,
}: {
  orig: { lat: number; long: number };
  dest: { lat: number; long: number };
}) {
  const R = 6371; // Earth's radius in km
  const d_lat = ((dest.lat - orig.lat) * Math.PI) / 180;
  const d_long = ((dest.long - orig.long) * Math.PI) / 180;
  const a =
    Math.sin(d_lat / 2) * Math.sin(d_lat / 2) +
    Math.cos((orig.lat * Math.PI) / 180) *
    Math.cos((dest.lat * Math.PI) / 180) *
    Math.sin(d_long / 2) *
    Math.sin(d_long / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
}
