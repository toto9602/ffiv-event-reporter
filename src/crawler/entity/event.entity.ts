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
}
