import { RateLimitAlgorithmType } from "./enums";
import { FixedWindowCounterRateLimiter } from "./algorithms/fixedWindowCounter";
import { LeakyBucketRateLimiter } from "./algorithms/leakyBucket";
import { RateLimiter } from "./rateLimiter";
import { SlidingWindowCounterRateLimiter } from "./algorithms/slidingWindowCounter";
import { SlidingWindowLogRateLimiter } from "./algorithms/slidingWindowLog";
import { SimpleTierRateLimitConfigProvider } from "./tierRateLimitConfigProvider";
import { TokenBucketRateLimiter } from "./algorithms/tokenBucket";
import { TierRateLimitConfigProvider, UserTierProvider } from "./types";

export class RateLimiterFactory {
  public static create(
    algorithmType: RateLimitAlgorithmType,
    userTierProvider: UserTierProvider,
    configProvider: TierRateLimitConfigProvider = new SimpleTierRateLimitConfigProvider(),
  ): RateLimiter {
    switch (algorithmType) {
      case RateLimitAlgorithmType.FIXED_WINDOW_COUNTER:
        return new RateLimiter(
          new FixedWindowCounterRateLimiter(),
          userTierProvider,
          configProvider,
        );

      case RateLimitAlgorithmType.SLIDING_WINDOW_LOG:
        return new RateLimiter(
          new SlidingWindowLogRateLimiter(),
          userTierProvider,
          configProvider,
        );

      case RateLimitAlgorithmType.SLIDING_WINDOW_COUNTER:
        return new RateLimiter(
          new SlidingWindowCounterRateLimiter(),
          userTierProvider,
          configProvider,
        );

      case RateLimitAlgorithmType.TOKEN_BUCKET:
        return new RateLimiter(
          new TokenBucketRateLimiter(),
          userTierProvider,
          configProvider,
        );

      case RateLimitAlgorithmType.LEAKY_BUCKET:
        return new RateLimiter(
          new LeakyBucketRateLimiter(),
          userTierProvider,
          configProvider,
        );
    }
  }
}
