import { BaseEntity } from "../../common/database/base.entity";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Event } from "./event.entity";
import { FeaturedReward } from "../../parser/dto/featured.reward";

interface CreateEventDetailArgs {
  event: Event;
  rawText: string;
}

@Entity({ tableName: "event_detail" })
export class EventDetail extends BaseEntity {
  @ManyToOne(() => Event, { name: "event_id" })
  event: Event;

  @Property({ type: "text", name: "raw_text" })
  rawText: string;

  @Property({ type: "datetime", name: "event_started_at", nullable: true })
  eventStartedAt: Date | null;

  @Property({ type: "datetime", name: "event_ended_at", nullable: true })
  eventEndedAt: Date | null;

  @Property({ type: "json", name: "featured_rewards", nullable: true })
  featuredRewards: FeaturedReward[] | null;

  @Property({ type: "datetime", name: "parsed_at", nullable: true })
  parsedAt: Date | null = null;

  public static of(args: CreateEventDetailArgs): EventDetail {
    const entity = new EventDetail();

    entity.event = args.event;
    entity.rawText = args.rawText;
    entity.eventStartedAt = null;
    entity.eventEndedAt = null;
    entity.featuredRewards = null;

    return entity;
  }

  public updateParsedDate(
    eventStartedAt: Date | null,
    eventEndedAt: Date | null,
    featuredRewards: FeaturedReward[] | null,
  ): void {
    this.eventStartedAt = eventStartedAt;
    this.eventEndedAt = eventEndedAt;
    this.featuredRewards = featuredRewards;

    this.parsedAt = new Date();
  }
}
