import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import { EventDto } from "./dto/event.dtos";

@Injectable()
export class EventHtmlParser {
  public parseEvents(html: string): Array<EventDto> {
    const $ = cheerio.load(html);

    return $("ul.banner_list.event li")
      .map((_, element) => {
        const title =
          $(element).find("span.txt_box span.title span.txt").text().trim() ||
          "N/A";

        const date =
          $(element).find("span.txt_box span.date").text().trim() || "N/A";

        const summary =
          $(element).find("span.txt_box span.summary").text().trim() || "N/A";

        const detailLink = $(element).find("a").attr("href")
          ? `https://www.ff14.co.kr${$(element).find("a").attr("href")}`
          : "N/A";

        const bannerImage = $(element)
          .find("span.banner_img_wrap span.banner_img")
          .css("background-image");

        const imageUrl = bannerImage
          ? "https:" + bannerImage.replace(/url\(['"]?(.*?)['"]?\)/, "$1")
          : null;

        return EventDto.of({ title, date, summary, detailLink, imageUrl });
      })
      .toArray();
  }
}
