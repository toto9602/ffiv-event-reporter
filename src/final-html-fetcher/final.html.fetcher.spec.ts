import { FinalHtmlFetcher } from "./final.html.fetcher";

jest.setTimeout(20000);

describe("FinalHtmlFetcher", () => {
  let finalHtmlFetcher: FinalHtmlFetcher;

  beforeEach(() => {
    finalHtmlFetcher = new FinalHtmlFetcher();
  });

  it("should fetch final HTML content", async () => {
    const url = "https://www.ff14.co.kr/events/fun/2025/princessday_egghunts";
    const content = await finalHtmlFetcher.fetchFinalHtml(url);
    console.log(content);
  });
});
