import { BaseEntity } from "../../common/database/base.entity";
import { Entity, Property } from "@mikro-orm/core";

@Entity({ tableName: "message_reply_history" })
export class MessageReplyHistory extends BaseEntity {
  @Property({ type: "datetime", name: "sent_at" })
  sentAt: Date;

  @Property({ name: "event_id" })
  eventId: number;

  @Property({ type: "varchar", name: "original_message_id" })
  originalMessageId: string;

  public static of(args: {
    sentAt: Date;
    eventId: number;
    originalMessageId: string;
  }): MessageReplyHistory {
    const entity = new MessageReplyHistory();
    entity.sentAt = args.sentAt;
    entity.eventId = args.eventId;
    entity.originalMessageId = args.originalMessageId;
    return entity;
  }
}
