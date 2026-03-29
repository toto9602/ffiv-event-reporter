import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import puppeteer from "puppeteer";

const MAX_ATTEMPTS = 3;

@Injectable()
export class EventDetailRenderer {
  private readonly logger = new Logger(EventDetailRenderer.name);

  async render(url: string): Promise<string> {
    const finalUrl = await this.toFinalUrl(url);
    return this.tryRender(finalUrl, 1);
  }

  private async tryRender(finalUrl: string, attempt: number): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      try {
        await page.goto(finalUrl, { waitUntil: "networkidle2", timeout: 30000 });
        return await page.content();
      } finally {
        await page.close();
      }
    } catch (e) {
      this.logger.warn(`렌더링 실패 (${attempt}/${MAX_ATTEMPTS}): ${e}`);
      if (attempt >= MAX_ATTEMPTS) throw e;
      return this.tryRender(finalUrl, attempt + 1);
    } finally {
      await browser.close();
    }
  }

  private async toFinalUrl(url: string): Promise<string> {
    const response = await axios.get(url, {
      maxRedirects: 10,
      responseType: "stream",
    });

    response.data.destroy();

    return (response.request.res?.responseUrl as string) ?? url;
  }
}
