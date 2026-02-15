import { RateLimitAlgorithmType } from "./enums";
import {
  RateLimitAlgorithm,
  RateLimitDecision,
  TierRateLimitConfigProvider,
  UserTierProvider,
} from "./types";

export class RateLimiter {
  constructor(
    private readonly algorithm: RateLimitAlgorithm,
    private readonly userTierProvider: UserTierProvider,
    private readonly configProvider: TierRateLimitConfigProvider,
  ) {}

  public getAlgorithmType(): RateLimitAlgorithmType {
    return this.algorithm.type;
  }

  public allowRequest(
    userId: string,
    nowMs: number = Date.now(),
  ): RateLimitDecision {
    const tier = this.userTierProvider.getTier(userId);
    const config = this.configProvider.getConfig(tier, this.algorithm.type);
    return this.algorithm.allow(userId, nowMs, config);
  }
}
