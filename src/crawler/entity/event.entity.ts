import { BaseEntity } from "../../common/database/base.entity";
import { Entity, Property } from "@mikro-orm/core";

interface CreateEventArgs {
  title: string;
  startDate: Date;
  endDate: Date;
  summary: string;
  detailLink: string;
  bannerUrl: string;
}

@Entity({ tableName: "events" })
export class Event extends BaseEntity {
  @Property({ type: "varchar" })
  title: string;

  @Property({ type: "date", name: "start_date" })
  startDate: Date;

  @Property({ type: "date", name: "end_date" })
  endDate: Date;

  @Property({ type: "varchar" })
  summary: string;

  @Property({ type: "varchar", name: "detail_link" })
  detailLink: string;

  @Property({ type: "varchar", name: "banner_url" })
  bannerUrl: string;

  @Property({ type: "datetime", name: "detail_crawled_at", nullable: true })
  detailCrawledAt: Date | null = null;

  @Property({ type: "datetime", name: "notified_at", nullable: true })
  notifiedAt: Date | null = null;

  public static of(args: CreateEventArgs): Event {
    const entity = new Event();

    entity.title = args.title;
    entity.startDate = args.startDate;
    entity.endDate = args.endDate;
    entity.summary = args.summary;
    entity.detailLink = args.detailLink;
    entity.bannerUrl = args.bannerUrl;

    return entity;
  }

  public updateDetailCrawledAt(date: Date): void {
    this.detailCrawledAt = date;
  }
}
