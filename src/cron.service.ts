import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "@shared/prisma.service";
import { FirebaseService } from "./firebase/firebase.service";

@Injectable()
export class CronService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async invalidOldRides() {
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

    const query = {
      where: {
        created_at: { lte: thirtyMinutesAgo },
        status: "SEARCHING",
      },
      data: {
        status: "CANCELLED",
      },
    } as const;

    // Take the first element
    const [oldRides] = await this.prisma.$transaction([
      // Take the result of the search
      this.prisma.ride.findMany({
        where: query.where,
      }),
      // Discard the result of update
      this.prisma.ride.updateMany(query),
    ]);

    for (const ride of oldRides) {
      await this.firebaseService.sendNotification({
        user_id: ride.customer_id,
        payload: { event_type: "RIDE_OFFER_CANCELLED", ride },
        title: "Ride Request Cancelled",
        body: `Your ride request took too long to find a driver.`,
      });
    }
  }
}
