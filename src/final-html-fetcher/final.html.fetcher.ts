import { Injectable } from "@nestjs/common";
import puppeteer from "puppeteer";

@Injectable()
export class FinalHtmlFetcher {
  public async fetchFinalHtml(url: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });

      // 페이지에서 텍스트만 추출하는 로직
      const extractedText = await page.evaluate(() => {
        // 불필요한 요소들 제거
        const elementsToRemove = document.querySelectorAll(
          'script, style, meta, link, noscript, iframe, svg, [style*="display:none"], [style*="display: none"]',
        );

        elementsToRemove.forEach((el) => el.remove());

        // 텍스트 컨텐츠만 추출하기
        const bodyText = document.body.innerText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line)
          .join("\n");

        return bodyText;
      });

      return extractedText;
    } finally {
      browser.close();
    }
  }
}
