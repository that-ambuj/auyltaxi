import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { RideService } from "./ride.service";
import { CreateRideDto } from "./dto/create-ride.dto";
import { Customer, Ride } from "@prisma/client";
import { UpdateRideDto } from "./dto/update-ride.dto";
import { CustomerGuard } from "@app/customer/customer.guard";
import { FastifyRequest } from "fastify";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("ride")
@UseGuards(CustomerGuard)
@Controller("ride")
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  async createRide(
    @Body() ride: CreateRideDto,
    @Req() req: FastifyRequest,
  ): Promise<Ride> {
    const user = req["user"] as Customer;

    return this.rideService.createRide(ride, user.id);
  }

  @Put(":id")
  async updateRidePrice(
    @Param("id") id: string,
    @Body() ride: UpdateRideDto,
    @Req() req: FastifyRequest,
  ): Promise<Ride> {
    const user = req["user"] as Customer;

    const updated_ride = await this.rideService.updateRide(ride, user.id, id);
    if (!updated_ride)
      throw new UnauthorizedException("This ride does not belong to this user");

    return updated_ride;
  }

  @Post(":id/cancel")
  async cancelRide(
    @Param("id") id: string,
    @Req() req: FastifyRequest,
  ): Promise<Ride | null> {
    const user = req["user"] as Customer;

    const updated_ride = await this.rideService.cancelRide(user.id, id);
    if (!updated_ride)
      throw new UnauthorizedException("This ride does not belong to this user");

    return updated_ride;
  }
}
