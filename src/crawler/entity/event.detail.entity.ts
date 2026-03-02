import { BaseEntity } from "../../common/database/base.entity";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Event } from "./event.entity";
import { FeaturedReward } from "../../parser/dto/featured.reward";

interface CreateEventDetailArgs {
  event: Event;
  rawText: string;
  eventStartedAt?: Date | null;
  eventEndedAt?: Date | null;
  featuredRewards?: FeaturedReward[] | null;
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
    entity.eventStartedAt = args.eventStartedAt ?? null;
    entity.eventEndedAt = args.eventEndedAt ?? null;
    entity.featuredRewards = args.featuredRewards ?? null;
    return entity;
  }
}
