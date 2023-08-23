import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { RideService } from "./ride.service";
import { CreateRideDto } from "./dto/create-ride.dto";
import { Customer, Ride } from "@prisma/client";
import { UpdateRideDto } from "./dto/update-ride.dto";
import { CustomerGuard } from "@app/customer/customer.guard";
import { FastifyRequest } from "fastify";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { RideStatus } from "./dto/ride-status.dto";

@ApiTags("rides")
@UseGuards(CustomerGuard)
@Controller("rides")
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Get()
  @ApiQuery({
    name: "status",
    enum: RideStatus,
    enumName: "RideStatus",
    required: false,
    isArray: true,
  })
  async getRides(
    @Req() req: FastifyRequest,
    @Query("status")
    status?: RideStatus | RideStatus[],
  ): Promise<Ride[]> {
    const user = req["user"] as Customer;

    return this.rideService.findAll(user.id, status);
  }

  @Get(":id")
  async getRideById(
    @Param("id") id: string,
    @Req() req: FastifyRequest,
  ): Promise<Ride> {
    const user = req["user"] as Customer;

    const ride = await this.rideService.findById(user.id, id);
    if (!ride) throw new NotFoundException(`Ride with id: ${id} not found.`);

    return ride;
  }

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
      throw new NotFoundException(`Ride with id: ${id} not found.`);

    return updated_ride;
  }

  @Post(":id/cancel")
  async cancelRide(
    @Param("id") id: string,
    @Req() req: FastifyRequest,
  ): Promise<Ride> {
    const user = req["user"] as Customer;

    const updated_ride = await this.rideService.cancelRide(user.id, id);
    if (!updated_ride)
      throw new NotFoundException(`Ride with id: ${id} not found.`);

    return updated_ride;
  }
}
