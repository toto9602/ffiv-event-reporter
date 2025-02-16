import { Module } from "@nestjs/common";
import { EventHtmlFetcher } from "./event.html.fetcher";
import { DI_SYMBOLS } from "./constants/di-symbols";
//https://github.com/lokalise/node-lokalise-api/issues/405
import got, { Got } from "got";
import { EventHtmlParser } from "./event.html.parser";
@Module({
  providers: [
    EventHtmlFetcher,
    EventHtmlParser,
    {
      provide: DI_SYMBOLS.GOT_INSTANCE,
      useFactory: () => {
        const client = got.extend({
          prefixUrl: "https://www.ff14.co.kr/",
        });
        return client;
      },
    },
  ],
  exports: [EventHtmlFetcher, EventHtmlParser],
})
export class CrawlerModule {}
