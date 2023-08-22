import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@shared/prisma.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [ConfigService, PrismaService],
})
export class HealthModule {}
