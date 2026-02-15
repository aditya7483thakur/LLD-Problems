import { RateLimitAlgorithmType } from "../enums";
import {
  RateLimitAlgorithm,
  RateLimitConfig,
  RateLimitDecision,
  WindowRateLimitConfig,
} from "../types";

type FixedWindowState = {
  windowStartMs: number;
  count: number;
};

export class FixedWindowCounterRateLimiter implements RateLimitAlgorithm {
  public readonly type = RateLimitAlgorithmType.FIXED_WINDOW_COUNTER;
  private readonly stateByUser = new Map<string, FixedWindowState>();

  public allow(
    userId: string,
    nowMs: number,
    config: RateLimitConfig,
  ): RateLimitDecision {
    const cfg = config as WindowRateLimitConfig;
    const windowStartMs = Math.floor(nowMs / cfg.windowMs) * cfg.windowMs;
    const windowEndMs = windowStartMs + cfg.windowMs;

    const state = this.stateByUser.get(userId);
    if (!state || state.windowStartMs !== windowStartMs) {
      this.stateByUser.set(userId, { windowStartMs, count: 1 });
      return {
        allowed: true,
        limit: cfg.maxRequests,
        remaining: cfg.maxRequests - 1,
        resetAtMs: windowEndMs,
      };
    }

    if (state.count >= cfg.maxRequests) {
      return {
        allowed: false,
        limit: cfg.maxRequests,
        remaining: 0,
        resetAtMs: windowEndMs,
        retryAfterMs: Math.max(0, windowEndMs - nowMs),
      };
    }

    state.count += 1;
    return {
      allowed: true,
      limit: cfg.maxRequests,
      remaining: cfg.maxRequests - state.count,
      resetAtMs: windowEndMs,
    };
  }
}
