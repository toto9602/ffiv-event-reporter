import { Injectable, NotFoundException } from "@nestjs/common";
import { convert } from "html-to-text";

@Injectable()
export class EventDetailTextExtractor {
  public extract(html: string): string {
    const parsedText = convert(html);

    return this.extractEventPeriodSnippet(parsedText, 40);
  }

  private extractEventPeriodSnippet(
    html: string,
    contextLength: number,
  ): string {
    const keyword = "이벤트 기간";

    const index = html.indexOf(keyword);

    if (index === -1) {
      throw new NotFoundException("이벤트 기간 텍스트 추출 실패");
    }

    const start = Math.max(0, index - contextLength);
    const end = Math.min(html.length, index + keyword.length + contextLength);

    return html.slice(start, end);
  }
}
