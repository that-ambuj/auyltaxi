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
  ForbiddenException,
} from "@nestjs/common";
import { RideService } from "./rides.service";
import { CreateRideDto } from "./dto/create-ride.dto";
import { Customer, Ride } from "@prisma/client";
import { UpdateRideDto } from "./dto/update-ride.dto";
import { CustomerGuard } from "@app/customer/customer.guard";
import { FastifyRequest } from "fastify";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { RideStatus } from "./dto/ride-status.dto";
import { RideOffersService } from "@app/ride-offers/ride-offers.service";
import { RideOfferStatus } from "@app/ride-offers/dto/ride-offer-status.dto";
import { GetRidesDto } from "./dto/get-rides.dto";

@ApiTags("Rides (customer)")
@UseGuards(CustomerGuard)
@Controller("rides")
export class RideController {
  constructor(
    private readonly rideService: RideService,
    private readonly rideOffersService: RideOffersService,
  ) {}

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
    @Query() data: GetRidesDto,
  ): Promise<Ride[]> {
    const user = req["user"] as Customer;

    const skip = (data.page - 1) * data.limit;

    return this.rideService.findAll({
      customer_id: user.id,
      status: data.status,
      skip,
      take: data.limit,
    });
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

    const existing_rides = await this.rideService.findAll({
      customer_id: user.id,
      status: RideStatus.SEARCHING,
    });

    if (existing_rides.length > 0) {
      throw new ForbiddenException(
        "There are already ride(s) requested. Please cancel them before requesting a new ride.",
      );
    }

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

  @Get(":id/offers")
  async getRideOffers(@Param("id") id: string, @Req() req: FastifyRequest) {
    const customer = req["user"] as Customer;

    const ride = await this.rideService.findById(customer.id, id);
    if (!ride) throw new NotFoundException(`Ride with id: ${id} not found.`);

    return this.rideOffersService.findAllByRideId({
      ride_id: id,
      status: [RideOfferStatus.PENDING, RideOfferStatus.REJECTED],
    });
  }

  @Post(":id/offers/:offer_id/accept")
  async acceptRideOffer(
    @Param("id") id: string,
    @Param("offer_id") offer_id: string,
    @Req() req: FastifyRequest,
  ) {
    const customer = req["user"] as Customer;

    const updated_ride = await this.rideService.acceptRideOffer({
      ride_id: id,
      offer_id,
      customer_id: customer.id,
    });

    return updated_ride;
  }
}
