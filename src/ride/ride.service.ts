import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/prisma.service";
import { CreateRideDto } from "./dto/create-ride.dto";
import { Ride } from "@prisma/client";
import { UpdateRideDto } from "./dto/update-ride.dto";

@Injectable()
export class RideService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(customer_id: string): Promise<Ride[]> {
    return this.prisma.ride.findMany({ where: { customer_id } });
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
