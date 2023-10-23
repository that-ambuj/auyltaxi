import { ProfileService } from "@app/profile/profile.service";
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Scope,
} from "@nestjs/common";
import { Ride, RideOffer } from "@prisma/client";
import {
  initializeApp,
  applicationDefault,
  type App,
  deleteApp,
  getApps,
} from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

type NotificationPayload = {
  event_type:
    | "RIDE_OFFER_CREATED"
    | "RIDE_OFFER_UPDATED"
    | "RIDE_OFFER_ACCEPTED"
    | "RIDE_OFFER_CANCELLED"
    | "RIDE_FINISHED";
  ride?: Ride;
  ride_offer?: RideOffer;
};

@Injectable({ scope: Scope.DEFAULT })
export class FirebaseService implements OnModuleInit, OnModuleDestroy {
  private app: App;

  constructor(private readonly profileService: ProfileService) {}

  onModuleInit() {
    const apps = getApps();

    if (apps.length != 0) {
      this.app = initializeApp({
        credential: applicationDefault(),
      });
    }
  }

  onModuleDestroy() {
    deleteApp(this.app);
  }

  async sendNotification({
    user_id,
    payload,
  }: {
    user_id: string;
    payload: NotificationPayload;
  }) {
    try {
      const user = await this.profileService.findById(user_id);

      const token = user.device_token;

      const res = await getMessaging().send({
        data: { payload: JSON.stringify(payload) },
        token,
      });
      console.info("Successfully sent notification from firebase:", res);

      return;
    } catch (e) {
      console.error("Error sending message/notification from firebase:", e);
    }
  }
}
