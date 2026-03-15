import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import axios from "axios";
import puppeteer, { Browser } from "puppeteer";

@Injectable()
export class EventDetailRenderer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventDetailRenderer.name);
  private browser: Browser;

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    this.logger.log("Puppeteer 브라우저 초기화 완료");
  }

  async onModuleDestroy() {
    await this.browser?.close();
    this.logger.log("Puppeteer 브라우저 종료");
  }

  async render(url: string): Promise<string> {
    const finalUrl = await this.toFinalUrl(url);

    const page = await this.browser.newPage();

    try {
      await page.goto(finalUrl, { waitUntil: "networkidle2", timeout: 30000 });
      return await page.content();
    } finally {
      await page.close();
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
