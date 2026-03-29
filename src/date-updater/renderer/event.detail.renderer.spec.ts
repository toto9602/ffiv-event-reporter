import { Test, TestingModule } from "@nestjs/testing";
import { EventDetailRenderer } from "./event.detail.renderer";

describe("EventDetailRenderer", () => {
  let module: TestingModule;
  let renderer: EventDetailRenderer;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [EventDetailRenderer],
    }).compile();

    renderer = module.get(EventDetailRenderer);
  });

  afterAll(async () => {
    await module.close();
  });

  describe("render", () => {
    it("페이지의 HTML 컨텐츠를 반환한다", async () => {
      const result = await renderer.render(
        "https://www.ff14.co.kr/events/2026/v7_4_promotion_new",
      );
      console.log(result);

      expect(result).toBeTruthy();
    }, 30000);
  });
});