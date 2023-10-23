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

  async findAllByRideId({
    ride_id,
    status,
  }: {
    ride_id: string;
    status?: RideOfferStatus | RideOfferStatus[];
  }) {
    if (Array.isArray(status)) {
      const status_arr = status.map((s) => ({ status: s }));

      return this.prisma.rideOffer.findMany({
        where: { ride_id, OR: status_arr },
        include: {
          driver: {
            select: {
              car: true,
              name: true,
              id: true,
              last_lat: true,
              last_long: true,
              phone_number: true,
              created_at: true,
              updated_at: true,
            },
          },
        },
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
      include: { ride: true, driver: true },
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
      include: { driver: true, ride: true },
    });
  }

  async cancelRideOffer({ id, driver_id }: { id: string; driver_id: string }) {
    return this.prisma.rideOffer.update({
      where: { id, driver_id },
      data: { status: "CANCELLED_BY_DRIVER" },
      include: { ride: true, driver: true },
    });
  }

  /**
   * WARNING: This method should only be used by the customer or
   * related controllers
   */
  async acceptRideOffer({ id, ride_id }: { id: string; ride_id: string }) {
    // Reject all the other offers
    await this.prisma.rideOffer.updateMany({
      where: { NOT: { id }, ride_id },
      data: { status: "REJECTED" },
    });

    return this.prisma.rideOffer.update({
      where: { id, ride_id },
      data: { status: "ACCEPTED" },
    });
  }
}
