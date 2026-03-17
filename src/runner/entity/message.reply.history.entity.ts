import { BaseEntity } from "../../common/database/base.entity";
import { Entity, Property } from "@mikro-orm/core";

@Entity({ tableName: "message_reply_histories" })
export class MessageReplyHistory extends BaseEntity {
  @Property({ type: "datetime", name: "sent_at" })
  sentAt: Date;

  @Property({ name: "event_id" })
  eventId: number;

  @Property({ type: "varchar", name: "original_message_id" })
  originalMessageId: string;

  @Property({ type: "varchar", name: "reply_message_id" })
  replyMessageId: string;

  public static of(args: {
    sentAt: Date;
    eventId: number;
    originalMessageId: string;
    replyMessageId: string;
  }): MessageReplyHistory {
    const entity = new MessageReplyHistory();
    entity.sentAt = args.sentAt;
    entity.eventId = args.eventId;
    entity.originalMessageId = args.originalMessageId;
    entity.replyMessageId = args.replyMessageId;
    return entity;
  }
}
