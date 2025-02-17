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
}
