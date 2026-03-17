import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { EventDateParser } from "./date.parser.interface";
import { DI_SYMBOLS } from "../../common/constants/di-symbols";
import { ParsedEventDate } from "./dto/parsed.event.date";
import { SYSTEM_PROMPT } from "./prompts/system.prompt";

@Injectable()
export class OpenAiEventDateParser implements EventDateParser {
  private readonly logger = new Logger(OpenAiEventDateParser.name);
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
  });

  constructor(
    @Inject(DI_SYMBOLS.LLM_CLIENT) private readonly client: OpenAI,
    private readonly configService: ConfigService,
  ) {
    this.openAiModel = configService.getOrThrow("OPENAI_MODEL");
    this.systemPrompt = SYSTEM_PROMPT;
  }

  async parse(rawText: string): Promise<ParsedEventDate> {
    try {
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
        };
      }

      return {
        eventStartedAt: parsed.event_started_at
          ? new Date(parsed.event_started_at)
          : null,
        eventEndedAt: parsed.event_ended_at
          ? new Date(parsed.event_ended_at)
          : null,
      };
    } catch (err) {
      this.logger.error("LLM 응답 파싱 중 오류 발생", err);

      return {
        eventStartedAt: null,
        eventEndedAt: null,
      };
    }
  }
}
