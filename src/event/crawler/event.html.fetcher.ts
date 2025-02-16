import { Injectable } from "@nestjs/common";
import { EventCategory } from "./constants/event.category";

@Injectable()
export class EventHtmlFetcher {
  private readonly baseURL = "https://www.ff14.co.kr/news/event";

  public async fetchEventsHTML() {
    const { default: got } = await import("got"); // 동적 import 사용
    const response = await got.get(
      this.baseURL + `?category=${EventCategory.IN_PROGRESS}`,
    );

    console.log(response.body);
  }
}
