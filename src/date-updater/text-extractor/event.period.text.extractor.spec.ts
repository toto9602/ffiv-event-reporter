import { Test, TestingModule } from "@nestjs/testing";
import { EventDetailTextExtractor } from "./event.detail.text.extractor";
import { EventPeriodTextExtractor } from "./event.period.text.extractor";

describe("EventPeriodTextExtractor", () => {
  let module: TestingModule;
  let textExtractor: EventPeriodTextExtractor;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [EventPeriodTextExtractor],
    }).compile();

    textExtractor = module.get(EventPeriodTextExtractor);
  });

  describe("convert", () => {
    it("이벤트 기간 앞뒤의 텍스트만 반환한다", async () => {
      const html = `홈페이지 바로가기 [\\"/main\\"]회원가입 [\\"#none\\"]게임시작 [\\"#start\\"]


안개 속 이상향지금 시작해도 설레는 함께 하는 모험

전 세계 3,000만 명과 함께 하는 모험!
역대급 혜택 받고 설레는 모험을 시작하세요.

이벤트 기간2.3(화)-3.2(월)보상 수령 기간2.3(화)-3.30(월)








70레벨 무료 플레이 혜택기간 제한 없이 70레벨까지 무료로 파이널판타지14의 모험을 플레이하세요.무료 플레이 바로가기
[\\"/events/pub/free\\"]
이벤트 참여 대상2026년 2월 3일(화) ~ 2026년 3월 2일(월) 기간 내 신규 가입한 계정
신규 가입일 확인하기 [\\"#none\\"]


혜택 하나! 신규 모험가 14일 접속 혜택`;

      const result = await textExtractor.extractEventPeriodSnippet(html, 20);
      console.log(result);
    });
  });
});
