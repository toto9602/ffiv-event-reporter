import { Module } from "@nestjs/common";
import { EventHtmlFetcher } from "./event.html.fetcher";

//https://github.com/lokalise/node-lokalise-api/issues/405
import { EventHtmlParser } from "./event.html.parser";

import got from "got";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { EventCrawler } from "./event.crawler";

@Module({
  providers: [
    EventCrawler,
    EventHtmlFetcher,
    EventHtmlParser,
    {
      provide: DI_SYMBOLS.EVENT_HTTP_INSTANCE,
      useFactory: () =>
        got.extend({
          prefixUrl: "https://www.ff14.co.kr/news/event",
        }),
    },
  ],
  exports: [EventCrawler],
})
export class CrawlerModule {}
