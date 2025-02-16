import { Module } from "@nestjs/common";
import { EventHtmlFetcher } from "./event.html.fetcher";

@Module({
  providers: [EventHtmlFetcher],
  exports: [EventHtmlFetcher],
})
export class CrawlerModule {}
