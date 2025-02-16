import { Injectable } from "@nestjs/common";

@Injectable()
export class EventService {
  public async getEvents() {
    return await Promise.resolve("");
  }
}
