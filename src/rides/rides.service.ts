import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/prisma.service";
import { CreateRideDto } from "./dto/create-ride.dto";
import { Ride } from "@prisma/client";
import { UpdateRideDto } from "./dto/update-ride.dto";
import { RideStatus } from "./dto/ride-status.dto";

@Injectable()
export class RideService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    customer_id: string,
    status?: RideStatus | RideStatus[],
  ): Promise<Ride[]> {
    if (Array.isArray(status)) {
      const status_arr = status.map((s) => ({ status: s }));

      return this.prisma.ride.findMany({
        where: { customer_id, OR: status_arr },
      });
    }

    return this.prisma.ride.findMany({
      where: { customer_id, status },
    });
  }

  async findById(customer_id: string, id: string): Promise<Ride | null> {
    return this.prisma.ride.findUnique({
      where: { customer_id, id },
      include: { assigned_to: true },
    });
  }

  async createRide(data: CreateRideDto, customer_id: string): Promise<Ride> {
    return this.prisma.ride.create({
      data: {
        ...data,
        customer_id,
      },
    });
  }

  async updateRide(
    data: UpdateRideDto,
    customer_id: string,
    ride_id: string,
  ): Promise<Ride | null> {
    return this.prisma.ride.update({
      where: { customer_id, id: ride_id },
      data,
    });
  }

  async cancelRide(customer_id: string, ride_id: string): Promise<Ride | null> {
    return this.prisma.ride.update({
      where: { customer_id, id: ride_id },
      data: { status: "CANCELLED" },
    });
  }
}
