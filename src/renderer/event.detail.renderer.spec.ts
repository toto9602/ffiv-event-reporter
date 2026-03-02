import { Test, TestingModule } from "@nestjs/testing";
import { EventDetailRenderer } from "./event.detail.renderer";

const toDataUrl = (html: string) =>
  `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;

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

  describe("onModuleInit", () => {
    it("Puppeteer 브라우저 인스턴스가 초기화된다", () => {
      expect((renderer as any).browser).toBeDefined();
    });
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

    it("렌더링 결과는 전체 HTML 문서 구조를 포함한다", async () => {
      const html = `<html><head><title>Test</title></head><body>Content</body></html>`;

      const result = await renderer.render(toDataUrl(html));

      expect(result).toContain("<html");
      expect(result).toContain("<head");
      expect(result).toContain("<body");
    }, 30000);

    it("여러 번 연속 호출해도 각각 독립적으로 동작한다", async () => {
      const [result1, result2] = await Promise.all([
        renderer.render(toDataUrl("<html><body>Page One</body></html>")),
        renderer.render(toDataUrl("<html><body>Page Two</body></html>")),
      ]);

      expect(result1).toContain("Page One");
      expect(result2).toContain("Page Two");
    }, 30000);

    it("유효하지 않은 URL 접근 시 에러를 던진다", async () => {
      await expect(
        renderer.render("http://localhost:1/unreachable"),
      ).rejects.toThrow();
    }, 30000);
  });

  describe("onModuleDestroy", () => {
    it("모듈 종료 후 브라우저가 닫혀 render 호출이 실패한다", async () => {
      const tempModule = await Test.createTestingModule({
        providers: [EventDetailRenderer],
      }).compile();

      await tempModule.init();
      const tempRenderer = tempModule.get(EventDetailRenderer);

      await tempModule.close();

      await expect(
        tempRenderer.render(toDataUrl("<html></html>")),
      ).rejects.toThrow();
    }, 30000);
  });
});