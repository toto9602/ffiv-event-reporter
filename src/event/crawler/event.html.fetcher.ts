import { Injectable } from "@nestjs/common";
import got from "got";
import { EventCategory } from "./constants/event.category";

@Injectable()
export class EventHtmlFetcher {
  private readonly gotInstance = got.extend({
    prefixUrl: "https://www.ff14.co.kr/news/event",
  });

  public async fetchEventsHTML(): Promise<string> {
    const response = await this.gotInstance.get({
      searchParams: { category: EventCategory.IN_PROGRESS },
    });

    return response.body;
  }
}
