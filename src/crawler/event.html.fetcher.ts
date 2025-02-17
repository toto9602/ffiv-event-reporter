import { Inject, Injectable } from "@nestjs/common";
import { Got } from "got";
import { EventCategory } from "./constants/event.category";
import { DI_SYMBOLS } from "../common/constants/di-symbols";

@Injectable()
export class EventHtmlFetcher {
  constructor(
    @Inject(DI_SYMBOLS.EVENT_HTTP_INSTANCE) private readonly http: Got,
  ) {}

  public async fetchEventsHTML(): Promise<string> {
    const response = await this.http.get({
      searchParams: { category: EventCategory.IN_PROGRESS },
    });

    return response.body;
  }
}
