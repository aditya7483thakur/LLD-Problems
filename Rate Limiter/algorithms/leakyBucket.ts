import { RateLimitAlgorithmType } from "../enums";
import {
  LeakyBucketRateLimitConfig,
  RateLimitAlgorithm,
  RateLimitConfig,
  RateLimitDecision,
} from "../types";

type LeakyBucketState = {
  level: number;
  lastLeakMs: number;
};

export class LeakyBucketRateLimiter implements RateLimitAlgorithm {
  public readonly type = RateLimitAlgorithmType.LEAKY_BUCKET;
  private readonly stateByUser = new Map<string, LeakyBucketState>();

  public allow(
    userId: string,
    nowMs: number,
    config: RateLimitConfig,
  ): RateLimitDecision {
    const cfg = config as LeakyBucketRateLimitConfig;
    const state =
      this.stateByUser.get(userId) ??
      ({ level: 0, lastLeakMs: nowMs } as LeakyBucketState);
    if (!this.stateByUser.has(userId)) this.stateByUser.set(userId, state);

    const elapsed = Math.max(0, nowMs - state.lastLeakMs);
    const leaked = elapsed * cfg.leakTokensPerMs;
    state.level = Math.max(0, state.level - leaked);
    state.lastLeakMs = nowMs;

    if (state.level + 1 > cfg.capacity) {
      const retryAfterMs =
        cfg.leakTokensPerMs > 0
          ? Math.ceil((state.level + 1 - cfg.capacity) / cfg.leakTokensPerMs)
          : Number.POSITIVE_INFINITY;
      const resetAtMs =
        cfg.leakTokensPerMs > 0
          ? nowMs + Math.ceil(state.level / cfg.leakTokensPerMs)
          : Number.POSITIVE_INFINITY;

      return {
        allowed: false,
        limit: cfg.capacity,
        remaining: 0,
        resetAtMs,
        retryAfterMs,
      };
    }

    state.level += 1;
    const remaining = Math.max(0, Math.floor(cfg.capacity - state.level));
    const resetAtMs =
      cfg.leakTokensPerMs > 0
        ? nowMs + Math.ceil(state.level / cfg.leakTokensPerMs)
        : Number.POSITIVE_INFINITY;

    return {
      allowed: true,
      limit: cfg.capacity,
      remaining,
      resetAtMs,
    };
  }
}
