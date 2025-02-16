import { Injectable } from "@nestjs/common";
import got from "got";

@Injectable()
export class EventHtmlFetcher {
  private readonly baseURL = "https://www.ff14.co.kr/news/event";

  public async fetchEventsHTML(): Promise<string> {
    const response = await got(this.baseURL + "?category=1");
    console.log(response.body);
    return response.body;
  }
}
// https://n8n.io/workflows/1951-scrape-and-summarize-webpages-with-ai/
