import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../common/database/base.entity";
import { ParsedEventDate } from "../dto/parsed.event.date";

interface CreateLlmResponseArgs {
  request: string;
  response: any;
}

@Entity({ tableName: "llm_response" })
export class LlmResponse extends BaseEntity {
  @Property({ type: "text" })
  request: string;

  @Property({ type: "json" })
  response: ParsedEventDate;

  public static of(args: CreateLlmResponseArgs): LlmResponse {
    const entity = new LlmResponse();

    entity.request = args.request;
    entity.response = args.response;

    return entity;
  }
}
