import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import OpenAI from "openai";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { Event } from "../crawler/entity/event.entity";
import { LlmResponse } from "./date-parser/entity/llm.response.entity";
import { EventDateUpdater } from "./event.date.updater";
import { EventDetailRenderer } from "./renderer/event.detail.renderer";
import { EventDetailTextExtractor } from "./text-extractor/event.detail.text.extractor";
import { OpenAiEventDateParser } from "./date-parser/openai.date.parser";

@Module({
  imports: [MikroOrmModule.forFeature([Event, LlmResponse])],
  providers: [
    EventDateUpdater,
    EventDetailRenderer,
    EventDetailTextExtractor,
    {
      provide: DI_SYMBOLS.LLM_CLIENT,
      useFactory: (config: ConfigService) => {
        return new OpenAI({
          apiKey: config.getOrThrow("OPENAI_API_KEY"),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: DI_SYMBOLS.EVENT_DATE_PARSER,
      useClass: OpenAiEventDateParser,
    },
  ],
  exports: [EventDateUpdater],
})
export class EventDateUpdaterModule {}
