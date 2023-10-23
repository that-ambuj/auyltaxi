import { DriverService } from "./driver.service";
import {
  Get,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Query,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { DriverGuard } from "./driver.guard";
import { FastifyRequest } from "fastify";
import { Driver } from "@prisma/client";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { ApiTags } from "@nestjs/swagger";
import { GetNearbyRidesDto } from "./dto/get-nearby-rides.dto";
import { GetRidesDriverDto } from "./dto/get-rides-driver.dto";
import { GetRidesHistoryDto } from "./dto/get-rides-history.dto";
import { FirebaseService } from "@app/firebase/firebase.service";

@ApiTags("Rides (Driver)")
@UseGuards(DriverGuard)
@Controller("driver")
export class DriverController {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly driverService: DriverService,
  ) {}

  @Get("location")
  async getLastLocation(@Req() req: FastifyRequest) {
    const driver = req["user"] as Driver;

    return this.driverService.getLocation({ id: driver.id });
  }

  @Post("location")
  async updateLastLocation(
    @Req() req: FastifyRequest,
    @Body() data: UpdateLocationDto,
  ) {
    const driver = req["user"] as Driver;

    return await this.driverService.updateLocation({
      id: driver.id,
      lat: data.lat,
      long: data.long,
    });
  }

  @Get("rides")
  async getRides(@Query() data: GetRidesDriverDto) {
    const skip = (data.page - 1) * data.limit;

    return this.driverService.findRides({ take: data.limit, skip });
  }

  @Get("nearbyRides")
  async getNearbyRides(
    @Req() req: FastifyRequest,
    @Query() data: GetNearbyRidesDto,
  ) {
    const driver = req["user"] as Driver;
    const skip = (data.page - 1) * data.limit;

    return this.driverService.getNearbyRides({
      id: driver.id,
      skip,
      take: data.limit,
      cursor: data.cursor,
      max_distance: data.max_distance,
    });
  }

  @Get("ridesHistory")
  async getRidesHistory(
    @Req() req: FastifyRequest,
    @Query() data: GetRidesHistoryDto,
  ) {
    const driver = req["user"] as Driver;

    return this.driverService.findRidesByDriverId({
      driver_id: driver.id,
      take: data.limit,
      skip: data.skip(),
      status: data.status,
    });
  }

  @Get("ridesHistory/:id")
  async getRideHistoryById(
    @Req() req: FastifyRequest,
    @Param("id") id: string,
  ) {
    const driver = req["user"] as Driver;

    return this.driverService.findRideByDriverId({ driver_id: driver.id, id });
  }

  @Post("rides/:id/finish")
  async finishRide(@Param("id") id: string, @Req() req: FastifyRequest) {
    const driver = req["user"] as Driver;

    const updated_ride = await this.driverService.markFinished({
      id,
      driver_id: driver.id,
    });

    if (!updated_ride)
      throw new NotFoundException(`The ride with id: ${id} does not exist`);

    await this.firebaseService.sendNotification({
      user_id: updated_ride.customer_id,
      payload: { event_type: "RIDE_FINISHED", ride: updated_ride },
    });

    return updated_ride;
  }

  @Get("balance/daily")
  async getAccount(@Req() req: FastifyRequest) {
    const driver = req["user"] as Driver;

    return this.driverService.getAccountInfoDaily({ driver_id: driver.id });
  }
}
