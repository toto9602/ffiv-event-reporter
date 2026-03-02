import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { EventDetailExtractor } from "./event.detail.extractor.interface";
import { ParsedEventContent } from "./dto/parsed.event.content";

@Injectable()
export class EventDetailOpenAiExtractor implements EventDetailExtractor {
  private readonly logger = new Logger(EventDetailOpenAiExtractor.name);
  private readonly client: OpenAI;
  private readonly openAiModel: string;
  private readonly systemPrompt: string;

  private readonly eventDetailSchema = z.object({
    event_started_at: z
      .string()
      .nullable()
      .describe(
        "Event start datetime in ISO 8601 format (e.g. 2024-01-15T10:00:00+09:00), or null if not found",
      ),
    event_ended_at: z
      .string()
      .nullable()
      .describe(
        "Event end datetime in ISO 8601 format (e.g. 2024-01-15T10:00:00+09:00), or null if not found",
      ),
    featured_rewards: z
      .array(z.string())
      .max(5)
      .describe("List of featured rewards (up to 5 items)"),
  });

  constructor(
    @Inject(DI_SYMBOLS.LLM_CLIENT) private readonly client: OpenAI,
    private readonly configService: ConfigService,
  ) {
    this.openAiModel = configService.getOrThrow("OPENAI_MODEL");
    this.systemPrompt = configService.getOrThrow("LLM_SYSTEM_PROMPT");
  }

  async extract(rawText: string): Promise<ParsedEventContent> {
    const response = await this.client.responses.parse({
      model: this.openAiModel,
      input: [
        {
          role: "system",
          content: this.systemPrompt,
        },
        {
          role: "user",
          content: rawText,
        },
      ],
      text: {
        format: zodTextFormat(this.eventDetailSchema, "event_content"),
      },
    });

    const parsed = response.output_parsed;
    if (!parsed) {
      this.logger.warn("LLM 응답이 비어 있습니다");
      return {
        eventStartedAt: null,
        eventEndedAt: null,
        featuredRewards: null,
      };
    }

    return {
      eventStartedAt: parsed.event_started_at
        ? new Date(parsed.event_started_at)
        : null,
      eventEndedAt: parsed.event_ended_at
        ? new Date(parsed.event_ended_at)
        : null,
      featuredRewards:
        parsed.featured_rewards.length > 0
          ? parsed.featured_rewards.join("\n")
          : null,
    };
  }
}
