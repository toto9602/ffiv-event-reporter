import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import type { AxiosInstance } from "axios";
import { DI_SYMBOLS } from "../common/constants/di-symbols";

@Injectable()
export class UrlGetter {
  constructor(
    @Inject(DI_SYMBOLS.URL_GETTER_HTTP_INSTANCE)
    private readonly httpClient: AxiosInstance,
  ) {}

  /**
   * URL을 입력받아 최종 리다이렉트된 URL을 반환합니다.
   * @param url 확인할 URL
   * @returns 최종 리다이렉트된 URL
   */
  public async getFinalRedirectUrl(url: string): Promise<string> {
    try {
      const response = await this.httpClient.get(url);

      // 300대 상태 코드면 Location 헤더에서 리다이렉트 URL 가져오기
      if (
        response.status >= HttpStatus.AMBIGUOUS &&
        response.status < HttpStatus.BAD_REQUEST
      ) {
        const redirectUrl = response.headers.location;

        // 상대 경로인 경우 절대 경로로 변환
        if (redirectUrl && !redirectUrl.startsWith("http")) {
          const baseUrl = new URL(url);
          return new URL(redirectUrl, baseUrl.origin).toString();
        }

        // 다시 리다이렉트된 URL로 재귀 호출
        return this.getFinalRedirectUrl(redirectUrl);
      }

      // 리다이렉트가 없는 경우 원래 URL 반환
      return url;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.headers?.location) {
        // 에러가 발생했지만 location 헤더가 있는 경우
        const redirectUrl = error.response.headers.location;

        // 상대 경로인 경우 절대 경로로 변환
        if (!redirectUrl.startsWith("http")) {
          const baseUrl = new URL(url);
          return this.getFinalRedirectUrl(
            new URL(redirectUrl, baseUrl.origin).toString(),
          );
        }

        return this.getFinalRedirectUrl(redirectUrl);
      }

      throw error;
    }
  }
}
