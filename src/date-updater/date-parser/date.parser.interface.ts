import { ParsedEventDate } from "./dto/parsed.event.date";

export interface EventDateParser {
  parse(rawText: string): Promise<ParsedEventDate>;
}
