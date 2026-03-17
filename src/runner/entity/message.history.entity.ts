import { BaseEntity } from "../../common/database/base.entity";
import { Entity, Property } from "@mikro-orm/core";

@Entity({ tableName: "message_history" })
export class MessageHistory extends BaseEntity {
  @Property({ type: "datetime", name: "sent_at" })
  sentAt: Date;

  @Property({ name: "event_id" })
  eventId: number;

  @Property({ type: "varchar", name: "message_id" })
  externalMessageID: string;

  public static of(args: {
    sentAt: Date;
    eventId: number;
    messageId: string;
  }): MessageHistory {
    const entity = new MessageHistory();
    entity.sentAt = args.sentAt;
    entity.eventId = args.eventId;
    entity.externalMessageID = args.messageId;
    return entity;
  }
}
