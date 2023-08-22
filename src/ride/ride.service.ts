import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { Ride } from '@prisma/client';

@Injectable()
export class RideService {
  constructor(private readonly prisma: PrismaService) {}

  async createRide(data: CreateRideDto, customer_id: string): Promise<Ride> {
    return this.prisma.ride.create({
      data: {
        ...data,
        customer_id,
      },
    });
  }
}
