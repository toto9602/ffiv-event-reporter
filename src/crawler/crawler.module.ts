import { Module } from "@nestjs/common";
import { EventHtmlFetcher } from "./event.html.fetcher";

//https://github.com/lokalise/node-lokalise-api/issues/405
import { EventHtmlParser } from "./event.html.parser";

import got from "got";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { EventCrawler } from "./event.crawler";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Event } from "./entity/event.entity";
import { EventDetail } from "./entity/event.detail.entity";
import { EventDetailCrawler } from "./event.detail.crawler";
import { RendererModule } from "../renderer/renderer.module";

@Module({
  imports: [MikroOrmModule.forFeature([Event, EventDetail]), RendererModule],
  providers: [
    EventCrawler,
    EventHtmlFetcher,
    EventHtmlParser,
    EventDetailCrawler,
    {
      provide: DI_SYMBOLS.EVENT_HTTP_INSTANCE,
      useFactory: () =>
        got.extend({
          prefixUrl: "https://www.ff14.co.kr/news/event",
        }),
    },
  ],
  exports: [EventCrawler, EventDetailCrawler],
})
export class CrawlerModule {}
