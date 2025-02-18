import { Event } from "../entity/event.entity";

interface EventDtoCreateArgs {
  title: string | null;
  date: string | null;
  summary: string | null;
  detailLink: string | null;
  imageUrl: string | null;
}

export class EventDto {
  title: string;
  date: string;
  summary: string;
  detailLink: string;
  imageUrl: string;

  private constructor(
    title: string,
    date: string,
    summary: string,
    detailLink: string,
    imageUrl: string,
  ) {
    this.title = title;
    this.date = date;
    this.summary = summary;
    this.detailLink = detailLink;
    this.imageUrl = imageUrl;
  }

  public static of({
    title,
    date,
    summary,
    detailLink,
    imageUrl,
  }: EventDtoCreateArgs): EventDto {
    return new EventDto(
      title || this.NOT_EXISTS,
      date || this.NOT_EXISTS,
      summary || this.NOT_EXISTS,
      detailLink || this.NOT_EXISTS,
      imageUrl || this.NOT_EXISTS,
    );
  }

  private static NOT_EXISTS = "N/A";

  public get startDate() {
    const [start, _] = this.date.split(" ~ ");
    return this.parseDate(start);
  }

  public get endDate() {
    const [_, end] = this.date.split(" ~ ");
    return this.parseDate(end);
  }

  private parseDate(dateString: string) {
    const [yy, mm, dd] = dateString.split("-").map(Number);
    const fullYear = 2000 + yy;

    return new Date(fullYear, mm - 1, dd);
  }
}

export interface FilterNewEventArgs {
  parsedEvents: EventDto[];
  savedEvents: Event[];
}
