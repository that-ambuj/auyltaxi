import { ProfileService } from "@app/profile/profile.service";
import { Module } from "@nestjs/common";

// TODO: Maybe add to app.module's imports list?
@Module({
  providers: [ProfileService],
})
export class FirebaseModule {}
