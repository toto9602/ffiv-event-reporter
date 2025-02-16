import { Injectable } from "@nestjs/common";
import { EventDto } from "./crawler/dto/event.dtos";
import { ConfigService } from "@nestjs/config";
import got, { Got } from "got";

@Injectable()
export class WorkflowRunner {
  private gotInstance: Got;

  constructor(private readonly config: ConfigService) {
    this.gotInstance = got.extend({
      prefixUrl: this.config.getOrThrow("WORKFLOW_URL"),
    });
  }

  public runReportEvents(events: EventDto[]) {
    this.gotInstance.post({ body: JSON.stringify(events) });
  }
}
