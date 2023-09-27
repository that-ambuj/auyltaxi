import {
  Body,
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  Query,
  Put,
  Param,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { RideOffersService } from "./ride-offers.service";
import { DriverGuard } from "@app/driver/driver.guard";
import { FastifyRequest } from "fastify";
import { Driver, RideOffer } from "@prisma/client";

import { CreateRideOfferDto } from "./dto/create-ride-offer.dto";
import { RideOfferStatus } from "./dto/ride-offer-status.dto";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { UpdateRideOfferDto } from "./dto/update-ride-offer.dto";
import { DriverService } from "@app/driver/driver.service";
import { RideStatusForHistory } from "@app/driver/dto/get-rides-history.dto";

@ApiTags("Ride Offers(Driver)")
@UseGuards(DriverGuard)
@Controller("ridesOffers")
export class RideOffersController {
  constructor(
    private readonly rideOffersService: RideOffersService,
    private readonly driverService: DriverService,
  ) {}

  @Get()
  @ApiQuery({
    name: "status",
    enum: RideOfferStatus,
    enumName: "RideOfferStatus",
    required: false,
    isArray: true,
  })
  async getRideOffers(
    @Req() req: FastifyRequest,
    @Query("status") status?: RideOfferStatus | RideOfferStatus[],
  ) {
    const driver = req["user"] as Driver;

    return this.rideOffersService.findAllByDriverId(driver.id, status);
  }

  @Post()
  async createRideOffer(
    @Req() req: FastifyRequest,
    @Body() ride_offer: CreateRideOfferDto,
  ): Promise<RideOffer> {
    const driver = req["user"] as Driver;

    const running_rides = await this.driverService.findRidesByDriverId({
      driver_id: driver.id,
      status: RideStatusForHistory.BOOKED,
      skip: 0,
      take: 1,
    });

    if (running_rides.length > 0) {
      throw new ForbiddenException(
        "Cannot send offer to another ride before finishing or cancelling an already running ride.",
      );
    }

    return this.rideOffersService.create(ride_offer, driver.id);
  }

  @Put(":id")
  async updateRideOffer(
    @Req() req: FastifyRequest,
    @Body() new_offer: UpdateRideOfferDto,
    @Param("id") id: string,
  ) {
    const driver = req["user"] as Driver;

    const updated_offer = await this.rideOffersService.updateById({
      id,
      driver_id: driver.id,
      data: new_offer,
    });

    if (!updated_offer)
      throw new NotFoundException(`Ride Offer with id: ${id} no found`);

    return updated_offer;
  }

  @Post(":id/cancel")
  async cancelRideOffer(@Req() req: FastifyRequest, @Param("id") id: string) {
    const driver = req["user"] as Driver;

    const updated_offer = await this.rideOffersService.cancelRideOffer({
      id,
      driver_id: driver.id,
    });

    if (!updated_offer)
      throw new NotFoundException(`Ride Offer with id: ${id} not found.`);

    return updated_offer;
  }
}
