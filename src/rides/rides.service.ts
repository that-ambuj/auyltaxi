import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/prisma.service";
import { CreateRideDto } from "./dto/create-ride.dto";
import { Ride } from "@prisma/client";
import { UpdateRideDto } from "./dto/update-ride.dto";
import { RideStatus } from "./dto/ride-status.dto";
import { RideOffersService } from "@app/ride-offers/ride-offers.service";
import { FirebaseService } from "@app/firebase/firebase.service";

@Injectable()
export class RideService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rideOfferService: RideOffersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async findAll({
    customer_id,
    status,
    take = 10,
    skip,
  }: {
    customer_id: string;
    status?: RideStatus | RideStatus[];
    take?: number;
    skip?: number;
  }): Promise<Ride[]> {
    if (Array.isArray(status)) {
      const status_arr = status.map((s) => ({ status: s }));

      return this.prisma.ride.findMany({
        where: { customer_id, OR: status_arr },
        skip,
        take,
      });
    }

    return this.prisma.ride.findMany({
      where: { customer_id, status },
      skip,
      take,
    });
  }

  async findById(customer_id: string, id: string): Promise<Ride | null> {
    return this.prisma.ride.findUnique({
      where: { customer_id, id },
      include: { assigned_to: true },
    });
  }

  async createRide(data: CreateRideDto, customer_id: string): Promise<Ride> {
    return this.prisma.ride.create({
      data: {
        ...data,
        customer_id,
      },
    });
  }

  async updateRide(
    data: UpdateRideDto,
    customer_id: string,
    ride_id: string,
  ): Promise<Ride | null> {
    return this.prisma.ride.update({
      where: { customer_id, id: ride_id },
      data,
    });
  }

  async acceptRideOffer({
    customer_id,
    ride_id,
    offer_id,
  }: {
    customer_id: string;
    ride_id: string;
    offer_id: string;
  }) {
    const updated_offer = await this.rideOfferService.acceptRideOffer({
      id: offer_id,
      ride_id,
    });

    const updated_ride = await this.prisma.ride.update({
      where: { id: ride_id, customer_id },
      data: {
        status: "BOOKED",
        driver_id: updated_offer.driver_id,
        confirmed_fare: updated_offer.proposed_fare,
      },
    });

    await this.firebaseService.sendNotification({
      user_id: updated_offer.driver_id,
      payload: {
        event_type: "RIDE_OFFER_ACCEPTED",
        ride_offer: updated_offer,
      },
      title: `Offer accepted`,
      body: `Your offer for ${updated_offer.proposed_fare} was accepted`,
    });

    return updated_ride;
  }

  async cancelRide(customer_id: string, ride_id: string): Promise<Ride | null> {
    return this.prisma.ride.update({
      where: { customer_id, id: ride_id },
      data: {
        status: "CANCELLED",
        ride_offers: {
          updateMany: {
            where: { ride_id },
            data: { status: "CANCELLED_BY_CUSTOMER" },
          },
        },
      },
    });
  }
}
