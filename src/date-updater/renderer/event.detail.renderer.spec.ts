import { Test, TestingModule } from "@nestjs/testing";
import { EventDetailRenderer } from "./event.detail.renderer";

describe("EventDetailRenderer", () => {
  let module: TestingModule;
  let renderer: EventDetailRenderer;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [EventDetailRenderer],
    }).compile();

    await module.init();
    renderer = module.get(EventDetailRenderer);
  }, 30000);

  afterAll(async () => {
    await module.close();
  });

  describe("render", () => {
    it("페이지의 HTML 컨텐츠를 반환한다", async () => {
      const html = `<html><body><h1>Hello World</h1><p>Test paragraph</p></body></html>`;

      const result = await renderer.render(
        "https://www.ff14.co.kr/events/2026/v7_4_promotion_new",
      );
      console.log(result);

      expect(result).toContain("Hello World");
      expect(result).toContain("Test paragraph");
    }, 30000);
  });
});
