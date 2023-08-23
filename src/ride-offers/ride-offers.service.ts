import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/prisma.service";
import { CreateRideOfferDto } from "./dto/create-ride-offer.dto";
import { RideOfferStatus } from "./dto/ride-offer-status.dto";
import { UpdateRideOfferDto } from "./dto/update-ride-offer.dto";

@Injectable()
export class RideOffersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByDriverId(
    driver_id: string,
    status?: RideOfferStatus | RideOfferStatus[],
  ) {
    if (Array.isArray(status)) {
      const status_arr = status.map((s) => ({ status: s }));

      return this.prisma.rideOffer.findMany({
        where: { driver_id, OR: status_arr },
      });
    }

    return this.prisma.rideOffer.findMany({ where: { driver_id, status } });
  }

  async findAllByRideId(
    ride_id: string,
    status?: RideOfferStatus | RideOfferStatus[],
  ) {
    if (Array.isArray(status)) {
      const status_arr = status.map((s) => ({ status: s }));

      return this.prisma.rideOffer.findMany({
        where: { ride_id, OR: status_arr },
      });
    }

    return this.prisma.rideOffer.findMany({
      where: { ride_id, status },
    });
  }

  async create(data: CreateRideOfferDto, driver_id: string) {
    return this.prisma.rideOffer.create({
      data: {
        driver_id,
        ...data,
      },
    });
  }

  async updateById({
    id,
    driver_id,
    data,
  }: {
    id: string;
    driver_id: string;
    data: UpdateRideOfferDto;
  }) {
    return this.prisma.rideOffer.update({
      where: { id, driver_id },
      data,
    });
  }

  async cancelRide({ id, driver_id }: { id: string; driver_id: string }) {
    return this.prisma.rideOffer.update({
      where: { id, driver_id },
      data: { status: "CANCELLED" },
    });
  }
}
