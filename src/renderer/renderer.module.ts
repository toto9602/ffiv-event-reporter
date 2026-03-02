import { Module } from "@nestjs/common";
import { EventDetailRenderer } from "./event.detail.renderer";
import { EventDetailTextExtractor } from "./event.detail.text.extractor";

@Module({
  providers: [EventDetailRenderer, EventDetailTextExtractor],
  exports: [EventDetailRenderer, EventDetailTextExtractor],
})
export class RendererModule {}