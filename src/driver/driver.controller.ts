import { DriverService } from "./driver.service";
import {
  Get,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Query,
} from "@nestjs/common";
import { DriverGuard } from "./driver.guard";
import { FastifyRequest } from "fastify";
import { Driver } from "@prisma/client";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { ApiTags } from "@nestjs/swagger";
import { GetNearbyRidesDto } from "./dto/get-nearby-rides.dto";
import { request } from "http";
import { GetRidesDriverDto } from "./dto/get-rides-driver.dto";

@ApiTags("Driver Location")
@UseGuards(DriverGuard)
@Controller("driver")
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

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
}
