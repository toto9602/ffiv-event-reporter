import { BaseEntity } from "../../common/database/base.entity";
import { Entity, Enum, Property } from "@mikro-orm/core";

export enum DateParseStatus {
  NOT_PARSED = "NOT_PARSED",
  SUCCESS = "SUCCESS",
  FALLBACK = "FALLBACK",
}

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

  @Property({ type: "datetime", name: "event_starts_at", nullable: true })
  eventStartedAt: Date | null = null;

  @Property({ type: "datetime", name: "event_ends_at", nullable: true })
  eventEndedAt: Date | null = null;

  @Property({ type: "varchar", name: "date_parse_status", nullable: true })
  dateParseStatus: DateParseStatus | null = null;

  @Property({ type: "datetime", name: "delivered_at", nullable: true })
  deliveredAt: Date | null;

  public static of(args: CreateEventArgs): Event {
    const entity = new Event();

    entity.title = args.title;
    entity.startDate = args.startDate;
    entity.endDate = args.endDate;
    entity.summary = args.summary;
    entity.detailLink = args.detailLink;
    entity.bannerUrl = args.bannerUrl;
    entity.dateParseStatus = DateParseStatus.NOT_PARSED;

    return entity;
  }

  public setParsedDates({
    eventStartedAt,
    eventEndedAt,
  }: {
    eventStartedAt: Date;
    eventEndedAt: Date;
  }): void {
    this.eventStartedAt = eventStartedAt;
    this.eventEndedAt = eventEndedAt;
    this.dateParseStatus = DateParseStatus.SUCCESS;
  }

  public setFallbackDates(): void {
    this.eventStartedAt = this.startDate;
    this.eventEndedAt = this.endDate;
    this.dateParseStatus = DateParseStatus.FALLBACK;
  }

  public markAsDelivered(now: Date): void {
    this.deliveredAt = now;
  }
}
