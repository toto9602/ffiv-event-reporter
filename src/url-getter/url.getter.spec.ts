import { Test, TestingModule } from "@nestjs/testing";
import { UrlGetter } from "./url.getter";
import axios from "axios";
import { DI_SYMBOLS } from "../common/constants/di-symbols";

describe("UrlGetter", () => {
  let urlGetter: UrlGetter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlGetter,
        {
          provide: DI_SYMBOLS.URL_GETTER_HTTP_INSTANCE,
          useFactory: () =>
            axios.create({
              maxRedirects: 0,
              validateStatus: (status) => status < 400,
            }),
        },
      ],
    }).compile();

    urlGetter = module.get<UrlGetter>(UrlGetter);
  });

  it("should return the original URL if no redirects occur", async () => {
    const result = await urlGetter.getFinalRedirectUrl(
      "https://www.ff14.co.kr/news/event/view/636?category=1&page=1",
    );
    console.log(result);
  });

  // it("should return the final redirected URL for a single redirect", async () => {
  //   const url = "https://example.com";
  //   const redirectUrl = "https://redirected.com";
  //   mockedAxios.create.mockReturnValue(mockedAxios);
  //   mockedAxios.get.mockResolvedValueOnce({
  //     status: 301,
  //     headers: { location: redirectUrl },
  //   });
  //   mockedAxios.get.mockResolvedValueOnce({ status: 200 });
  //
  //   const result = await urlGetter.getFinalRedirectUrl(url);
  //   expect(result).toBe(redirectUrl);
  // });
  //
  // it("should handle multiple redirects and return the final URL", async () => {
  //   const url = "https://example.com";
  //   const redirectUrl1 = "https://redirect1.com";
  //   const redirectUrl2 = "https://redirect2.com";
  //   mockedAxios.create.mockReturnValue(mockedAxios);
  //   mockedAxios.get
  //     .mockResolvedValueOnce({
  //       status: 301,
  //       headers: { location: redirectUrl1 },
  //     })
  //     .mockResolvedValueOnce({
  //       status: 301,
  //       headers: { location: redirectUrl2 },
  //     })
  //     .mockResolvedValueOnce({ status: 200 });
  //
  //   const result = await urlGetter.getFinalRedirectUrl(url);
  //   expect(result).toBe(redirectUrl2);
  // });
  //
  // it("should throw an error if the request fails without a location header", async () => {
  //   const url = "https://example.com";
  //   mockedAxios.create.mockReturnValue(mockedAxios);
  //   mockedAxios.get.mockRejectedValueOnce(new Error("Request failed"));
  //
  //   await expect(urlGetter.getFinalRedirectUrl(url)).rejects.toThrow(
  //     "Request failed",
  //   );
  // });
  //
  // it("should handle relative redirect URLs correctly", async () => {
  //   const url = "https://example.com";
  //   const relativeRedirect = "/redirected";
  //   const absoluteRedirect = "https://example.com/redirected";
  //   mockedAxios.create.mockReturnValue(mockedAxios);
  //   mockedAxios.get.mockResolvedValueOnce({
  //     status: 301,
  //     headers: { location: relativeRedirect },
  //   });
  //   mockedAxios.get.mockResolvedValueOnce({ status: 200 });
  //
  //   const result = await urlGetter.getFinalRedirectUrl(url);
  //   expect(result).toBe(absoluteRedirect);
  // });
});
