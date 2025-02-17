import { Inject, Injectable } from "@nestjs/common";
import { EventDto } from "../crawler/dto/event.dtos";
import { Got } from "got";
import { DI_SYMBOLS } from "../common/constants/di-symbols";

@Injectable()
export class WorkflowRunner {
  constructor(
    @Inject(DI_SYMBOLS.WORKFLOW_HTTP_INSTANCE) private readonly http: Got,
  ) {}

  public runReportEvents(events: EventDto[]) {
    this.http.post({ body: JSON.stringify(events) });
  }
}
