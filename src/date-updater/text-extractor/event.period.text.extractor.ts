import { Injectable } from "@nestjs/common";
import { convert } from "html-to-text";

@Injectable()
export class EventPeriodTextExtractor {
  extract(html: string): string {
    return convert(html);
  }

  extractEventPeriodSnippet(html: string, contextLength = 10): string | null {
    const text = this.extract(html);
    const keyword = "이벤트 기간";
    const index = text.indexOf(keyword);
    if (index === -1) return null;
    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + keyword.length + contextLength);
    return text.slice(start, end);
  }
}
