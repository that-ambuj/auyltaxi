import { ProfileService } from "@app/profile/profile.service";
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Scope,
} from "@nestjs/common";
import {
  initializeApp,
  applicationDefault,
  type App,
  deleteApp,
  getApps,
} from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

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
    message,
  }: {
    user_id: string;
    message: string;
  }) {
    try {
      const user = await this.profileService.findById(user_id);

      const token = user.device_token;

      const res = await getMessaging().send({ data: { message }, token });
      console.info("Successfully sent notification from firebase:", res);

      return;
    } catch (e) {
      console.error("Error sending message/notification from firebase:", e);
    }
  }
}
