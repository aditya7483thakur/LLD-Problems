import { RateLimitAlgorithmType } from "../enums";
import {
  RateLimitAlgorithm,
  RateLimitConfig,
  RateLimitDecision,
  WindowRateLimitConfig,
} from "../types";

type SlidingLogState = {
  timestampsMs: number[];
};

export class SlidingWindowLogRateLimiter implements RateLimitAlgorithm {
  public readonly type = RateLimitAlgorithmType.SLIDING_WINDOW_LOG;
  private readonly stateByUser = new Map<string, SlidingLogState>();

  public allow(
    userId: string,
    nowMs: number,
    config: RateLimitConfig,
  ): RateLimitDecision {
    const cfg = config as WindowRateLimitConfig;
    const windowStartMs = nowMs - cfg.windowMs;

    const state = this.stateByUser.get(userId) ?? { timestampsMs: [] };
    if (!this.stateByUser.has(userId)) this.stateByUser.set(userId, state);

    while (
      state.timestampsMs.length > 0 &&
      state.timestampsMs[0] <= windowStartMs
    ) {
      state.timestampsMs.shift();
    }

    if (state.timestampsMs.length >= cfg.maxRequests) {
      const oldest = state.timestampsMs[0];
      const resetAtMs = oldest + cfg.windowMs;
      return {
        allowed: false,
        limit: cfg.maxRequests,
        remaining: 0,
        resetAtMs,
        retryAfterMs: Math.max(0, resetAtMs - nowMs),
      };
    }

    state.timestampsMs.push(nowMs);
    const oldest = state.timestampsMs[0];
    const resetAtMs = oldest + cfg.windowMs;

    return {
      allowed: true,
      limit: cfg.maxRequests,
      remaining: Math.max(0, cfg.maxRequests - state.timestampsMs.length),
      resetAtMs,
    };
  }
}
