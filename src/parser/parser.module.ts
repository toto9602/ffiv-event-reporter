import { Module } from "@nestjs/common";
import { EventContentParser } from "./event.content.parser";
import { EventDetailOpenAiExtractor } from "./event.detail.openai.extractor";
import { ConfigService } from "@nestjs/config";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { EventDetail } from "../crawler/entity/event.detail.entity";
import OpenAI from "openai";

@Module({
  imports: [MikroOrmModule.forFeature([EventDetail])],
  providers: [
    EventDetailOpenAiExtractor,
    EventContentParser,
    {
      provide: DI_SYMBOLS.LLM_CLIENT,
      useFactory: (config: ConfigService) => {
        return new OpenAI({
          apiKey: config.getOrThrow("OPENAI_API_KEY"),
        });
      },
    },
    {
      provide: DI_SYMBOLS.EVENT_DETAIL_EXTRACTOR,
      useClass: EventDetailOpenAiExtractor,
    },
  ],
  exports: [EventContentParser],
})
export class ParserModule {}
