import { RateLimitAlgorithmType, UserTier } from "./enums";

export type RateLimitDecision = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAtMs: number;
  retryAfterMs?: number;
};

export type WindowRateLimitConfig = {
  type:
    | RateLimitAlgorithmType.FIXED_WINDOW_COUNTER
    | RateLimitAlgorithmType.SLIDING_WINDOW_LOG
    | RateLimitAlgorithmType.SLIDING_WINDOW_COUNTER;
  windowMs: number;
  maxRequests: number;
};

export type TokenBucketRateLimitConfig = {
  type: RateLimitAlgorithmType.TOKEN_BUCKET;
  capacity: number;
  refillTokensPerMs: number;
};

export type LeakyBucketRateLimitConfig = {
  type: RateLimitAlgorithmType.LEAKY_BUCKET;
  capacity: number;
  leakTokensPerMs: number;
};

export type RateLimitConfig =
  | WindowRateLimitConfig
  | TokenBucketRateLimitConfig
  | LeakyBucketRateLimitConfig;

export interface UserTierProvider {
  getTier(userId: string): UserTier;
}

export interface TierRateLimitConfigProvider {
  getConfig(
    tier: UserTier,
    algorithmType: RateLimitAlgorithmType,
  ): RateLimitConfig;
}

export interface RateLimitAlgorithm {
  readonly type: RateLimitAlgorithmType;
  allow(
    userId: string,
    nowMs: number,
    config: RateLimitConfig,
  ): RateLimitDecision;
}
