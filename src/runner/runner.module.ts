import { Module } from "@nestjs/common";
import { WorkflowRunner } from "./workflow.runner";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { WorkflowLog } from "./entity/workflow.log.entity";
import { Event } from "../crawler/entity/event.entity";

@Module({
  imports: [MikroOrmModule.forFeature([WorkflowLog, Event])],
  providers: [
    WorkflowRunner,
    {
      provide: DI_SYMBOLS.WORKFLOW_HTTP_INSTANCE,
      useFactory: (config: ConfigService) =>
        got.extend({
          prefixUrl: config.getOrThrow("WORKFLOW_URL"),
        }),
      inject: [ConfigService],
    },
  ],
  exports: [WorkflowRunner],
})
export class RunnerModule {}
