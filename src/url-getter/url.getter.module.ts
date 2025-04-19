import { HttpStatus, Module } from "@nestjs/common";
import { UrlGetter } from "./url.getter";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import axios from "axios";

@Module({
  providers: [
    UrlGetter,
    {
      provide: DI_SYMBOLS.URL_GETTER_HTTP_INSTANCE,
      useFactory: () =>
        axios.create({
          maxRedirects: 0,
          validateStatus: (status) => status < HttpStatus.BAD_REQUEST,
        }),
    },
  ],
})
export class UrlGetterModule {}
