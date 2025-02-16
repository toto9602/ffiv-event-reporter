import { Module } from "@nestjs/common";
import { EventModule } from "./event/event.module";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(
        __dirname,
        "../env",
        `.${process.env.NODE_ENV}.env`,
      ),
      isGlobal: true,
    }),
    EventModule,
  ],
})
export class AppModule {}
