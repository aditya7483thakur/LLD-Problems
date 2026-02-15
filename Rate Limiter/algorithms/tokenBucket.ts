import { RateLimitAlgorithmType } from "../enums";
import {
  RateLimitAlgorithm,
  RateLimitConfig,
  RateLimitDecision,
  TokenBucketRateLimitConfig,
} from "../types";

type TokenBucketState = {
  tokens: number;
  lastRefillMs: number;
};

export class TokenBucketRateLimiter implements RateLimitAlgorithm {
  public readonly type = RateLimitAlgorithmType.TOKEN_BUCKET;
  private readonly stateByUser = new Map<string, TokenBucketState>();

  public allow(
    userId: string,
    nowMs: number,
    config: RateLimitConfig,
  ): RateLimitDecision {
    const cfg = config as TokenBucketRateLimitConfig;
    const state =
      this.stateByUser.get(userId) ??
      ({ tokens: cfg.capacity, lastRefillMs: nowMs } as TokenBucketState);
    if (!this.stateByUser.has(userId)) this.stateByUser.set(userId, state);

    const elapsed = Math.max(0, nowMs - state.lastRefillMs);
    const refill = elapsed * cfg.refillTokensPerMs;
    state.tokens = Math.min(cfg.capacity, state.tokens + refill);
    state.lastRefillMs = nowMs;

    if (state.tokens < 1) {
      const retryAfterMs =
        cfg.refillTokensPerMs > 0
          ? Math.ceil((1 - state.tokens) / cfg.refillTokensPerMs)
          : Number.POSITIVE_INFINITY;
      const resetAtMs =
        cfg.refillTokensPerMs > 0
          ? nowMs +
            Math.ceil((cfg.capacity - state.tokens) / cfg.refillTokensPerMs)
          : Number.POSITIVE_INFINITY;
      return {
        allowed: false,
        limit: cfg.capacity,
        remaining: 0,
        resetAtMs,
        retryAfterMs,
      };
    }

    state.tokens -= 1;
    const resetAtMs =
      cfg.refillTokensPerMs > 0
        ? nowMs +
          Math.ceil((cfg.capacity - state.tokens) / cfg.refillTokensPerMs)
        : Number.POSITIVE_INFINITY;

    return {
      allowed: true,
      limit: cfg.capacity,
      remaining: Math.floor(state.tokens),
      resetAtMs,
    };
  }
}
