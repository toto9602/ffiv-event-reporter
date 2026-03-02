import { ParsedEventContent } from "./dto/parsed.event.content";

export interface EventDetailExtractor {
  extract(rawText: string): Promise<ParsedEventContent>;
}
