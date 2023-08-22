import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/prisma.service";
import { CreateRideDto } from "./dto/create-ride.dto";
import { Ride } from "@prisma/client";
import { UpdateRideDto } from "./dto/update-ride.dto";

@Injectable()
export class RideService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Ride | null> {
    return this.prisma.ride.findUnique({ where: { id } });
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
