import { RateLimitAlgorithmType } from "../enums";
import {
  RateLimitAlgorithm,
  RateLimitConfig,
  RateLimitDecision,
  WindowRateLimitConfig,
} from "../types";

type SlidingCounterState = {
  currentWindowStartMs: number;
  currentCount: number;
  previousCount: number;
};

export class SlidingWindowCounterRateLimiter implements RateLimitAlgorithm {
  public readonly type = RateLimitAlgorithmType.SLIDING_WINDOW_COUNTER;
  private readonly stateByUser = new Map<string, SlidingCounterState>();

  public allow(
    userId: string,
    nowMs: number,
    config: RateLimitConfig,
  ): RateLimitDecision {
    const cfg = config as WindowRateLimitConfig;
    const currentWindowStartMs =
      Math.floor(nowMs / cfg.windowMs) * cfg.windowMs;
    const windowEndMs = currentWindowStartMs + cfg.windowMs;

    const existing = this.stateByUser.get(userId);
    if (!existing) {
      this.stateByUser.set(userId, {
        currentWindowStartMs,
        currentCount: 1,
        previousCount: 0,
      });
      return {
        allowed: true,
        limit: cfg.maxRequests,
        remaining: cfg.maxRequests - 1,
        resetAtMs: windowEndMs,
      };
    }

    if (existing.currentWindowStartMs !== currentWindowStartMs) {
      const windowDiff = currentWindowStartMs - existing.currentWindowStartMs;
      if (windowDiff >= cfg.windowMs * 2) {
        existing.previousCount = 0;
      } else {
        existing.previousCount = existing.currentCount;
      }
      existing.currentWindowStartMs = currentWindowStartMs;
      existing.currentCount = 0;
    }

    const elapsedInCurrentMs = nowMs - existing.currentWindowStartMs;
    const weightPrev = Math.max(0, 1 - elapsedInCurrentMs / cfg.windowMs);
    const estimatedCount =
      existing.previousCount * weightPrev + existing.currentCount;

    if (estimatedCount >= cfg.maxRequests) {
      return {
        allowed: false,
        limit: cfg.maxRequests,
        remaining: 0,
        resetAtMs: windowEndMs,
        retryAfterMs: Math.max(0, windowEndMs - nowMs),
      };
    }

    existing.currentCount += 1;
    const newEstimated =
      existing.previousCount * weightPrev + existing.currentCount;
    const remaining = Math.max(0, Math.floor(cfg.maxRequests - newEstimated));

    return {
      allowed: true,
      limit: cfg.maxRequests,
      remaining,
      resetAtMs: windowEndMs,
    };
  }
}
