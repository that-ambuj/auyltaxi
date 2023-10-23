import { ProfileService } from "@app/profile/profile.service";
import { Injectable } from "@nestjs/common";
import { Ride, RideOffer } from "@prisma/client";
import { getMessaging } from "firebase-admin/messaging";

type NotificationPayload = {
  event_type:
    | "RIDE_OFFER_CREATED"
    | "RIDE_OFFER_UPDATED"
    | "RIDE_OFFER_ACCEPTED"
    | "RIDE_OFFER_CANCELLED"
    | "RIDE_FINISHED";
  ride_offer?: RideOffer;
  ride?: Ride;
};

@Injectable()
export class FirebaseService {
  constructor(private readonly profileService: ProfileService) {}

  async sendNotification({
    user_id,
    payload,
    body,
    title,
  }: {
    user_id: string;
    payload: NotificationPayload;
    body: string;
    title: string;
  }) {
    try {
      const user = await this.profileService.findById(user_id);

      const token = user.device_token;

      const res = await getMessaging().send({
        data: { payload: JSON.stringify(payload) },
        token,
        notification: { body, title },
      });
      console.info("Successfully sent notification from firebase:", res);

      return;
    } catch (e) {
      console.error("Error sending message/notification from firebase:", e);
    }
  }
}
