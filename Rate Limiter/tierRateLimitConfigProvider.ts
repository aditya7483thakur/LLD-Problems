import { RateLimitAlgorithmType, UserTier } from "./enums";
import {
  LeakyBucketRateLimitConfig,
  RateLimitConfig,
  TierRateLimitConfigProvider,
  TokenBucketRateLimitConfig,
  WindowRateLimitConfig,
} from "./types";

type TierBaseConfig = {
  requestsPerMinute: number;
};

export class SimpleTierRateLimitConfigProvider implements TierRateLimitConfigProvider {
  private readonly windowMs: number;
  private readonly tierBase: Record<UserTier, TierBaseConfig>;

  constructor(
    tierBase: Record<UserTier, TierBaseConfig> = {
      [UserTier.FREE]: { requestsPerMinute: 5 },
      [UserTier.PREMIUM]: { requestsPerMinute: 20 },
    },
    windowMs = 60_000,
  ) {
    this.tierBase = tierBase;
    this.windowMs = windowMs;
  }

  public getConfig(
    tier: UserTier,
    algorithmType: RateLimitAlgorithmType,
  ): RateLimitConfig {
    const rpm = this.tierBase[tier].requestsPerMinute;
    const perMs = rpm / this.windowMs;

    switch (algorithmType) {
      case RateLimitAlgorithmType.FIXED_WINDOW_COUNTER:
      case RateLimitAlgorithmType.SLIDING_WINDOW_LOG:
      case RateLimitAlgorithmType.SLIDING_WINDOW_COUNTER: {
        const cfg: WindowRateLimitConfig = {
          type: algorithmType,
          windowMs: this.windowMs,
          maxRequests: rpm,
        };
        return cfg;
      }

      case RateLimitAlgorithmType.TOKEN_BUCKET: {
        const cfg: TokenBucketRateLimitConfig = {
          type: algorithmType,
          capacity: rpm,
          refillTokensPerMs: perMs,
        };
        return cfg;
      }

      case RateLimitAlgorithmType.LEAKY_BUCKET: {
        const cfg: LeakyBucketRateLimitConfig = {
          type: algorithmType,
          capacity: rpm,
          leakTokensPerMs: perMs,
        };
        return cfg;
      }
    }
  }
}
