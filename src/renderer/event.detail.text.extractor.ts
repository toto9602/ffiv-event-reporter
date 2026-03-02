import { Injectable, Logger } from "@nestjs/common";
import * as cheerio from "cheerio";
import { createWorker } from "tesseract.js";

const BASE_URL = "https://www.ff14.co.kr";

@Injectable()
export class EventDetailTextExtractor {
  private readonly logger = new Logger(EventDetailTextExtractor.name);

  async extract(html: string): Promise<string> {
    const $ = cheerio.load(html);

    $("script, style, noscript, header, footer, nav").remove();
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    const imgUrls = this.extractImageUrls($);
    this.logger.log(`이미지 ${imgUrls.length}개 OCR 처리 시작`);

    const ocrTexts = await this.ocrImages(imgUrls);

    return [bodyText, ...ocrTexts].filter(Boolean).join("\n\n");
  }

  private extractImageUrls($: cheerio.CheerioAPI): string[] {
    const urls: string[] = [];

    $("img").each((_, el) => {
      const src = $(el).attr("src");
      if (!src) return;

      const absUrl = src.startsWith("http")
        ? src
        : `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
      urls.push(absUrl);
    });

    return urls;
  }

  private async ocrImages(urls: string[]): Promise<string[]> {
    if (urls.length === 0) return [];

    const worker = await createWorker(["kor", "eng"]);
    const results: string[] = [];

    try {
      for (const url of urls) {
        try {
          const {
            data: { text },
          } = await worker.recognize(url);
          if (text.trim()) results.push(text.trim());
        } catch {
          this.logger.warn(`이미지 OCR 실패: ${url}`);
        }
      }
    } finally {
      await worker.terminate();
    }

    return results;
  }
}