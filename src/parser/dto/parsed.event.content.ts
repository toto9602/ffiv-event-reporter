import { FeaturedReward } from "./featured.reward";

export interface ParsedEventContent {
  eventStartedAt: Date | null;
  eventEndedAt: Date | null;
  featuredRewards: FeaturedReward[] | null;
}
