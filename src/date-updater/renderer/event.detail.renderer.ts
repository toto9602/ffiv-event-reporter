import { Injectable } from "@nestjs/common";
import axios from "axios";
import puppeteer from "puppeteer";

@Injectable()
export class EventDetailRenderer {
  async render(url: string): Promise<string> {
    const finalUrl = await this.toFinalUrl(url);

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
