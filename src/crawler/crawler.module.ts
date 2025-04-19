import { Module } from "@nestjs/common";
import { EventHtmlFetcher } from "./event.html.fetcher";

//https://github.com/lokalise/node-lokalise-api/issues/405
import { EventHtmlParser } from "./event.html.parser";

import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { EventCrawler } from "./event.crawler";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Event } from "./entity/event.entity";
import axios from "axios";

@Module({
  imports: [MikroOrmModule.forFeature([Event])],
  providers: [
    EventCrawler,
    EventHtmlFetcher,
    EventHtmlParser,
    {
      provide: DI_SYMBOLS.EVENT_HTTP_INSTANCE,
      useFactory: () =>
        axios.create({
          baseURL: "https://www.ff14.co.kr/news/event",
        }),
    },
  ],
  exports: [EventCrawler],
})
export class CrawlerModule {}
