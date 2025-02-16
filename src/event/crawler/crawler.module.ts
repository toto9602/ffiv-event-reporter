import { Module } from "@nestjs/common";
import { EventHtmlFetcher } from "./event.html.fetcher";

//https://github.com/lokalise/node-lokalise-api/issues/405
import { EventHtmlParser } from "./event.html.parser";

@Module({
  providers: [EventHtmlFetcher, EventHtmlParser],
  exports: [EventHtmlFetcher, EventHtmlParser],
})
export class CrawlerModule {}
