import { Body, Controller, Post, Session } from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { Session as TSession } from '@fastify/secure-session';
import { Ride } from '@prisma/client';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  async createRide(
    @Body() ride: CreateRideDto,
    @Session() session: TSession,
  ): Promise<Ride> {
    const user_id = session.get('data');

    return this.rideService.createRide(ride, user_id);
  }
}
