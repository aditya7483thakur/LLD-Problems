import { RateLimitAlgorithmType, UserTier } from "./enums";
import { RateLimiterFactory } from "./rateLimiterFactory";
import { InMemoryUserTierStore } from "./userTierStore";

function runBurstTest(algorithmType: RateLimitAlgorithmType) {
  const userStore = new InMemoryUserTierStore();
  userStore.setTier("freeUser", UserTier.FREE);
  userStore.setTier("premiumUser", UserTier.PREMIUM);

  const limiter = RateLimiterFactory.create(algorithmType, userStore);

  console.log(`\n=== Rate Limiter Demo: ${limiter.getAlgorithmType()} ===`);
  console.log("Free tier: 5 req/min (expect deny on 6th)");

  for (let i = 1; i <= 6; i++) {
    const res = limiter.allowRequest("freeUser");
    console.log(
      `freeUser req#${i}: allowed=${res.allowed}, remaining=${res.remaining}, retryAfterMs=${res.retryAfterMs ?? 0}`,
    );
  }

  console.log(
    "\nPremium tier: 20 req/min (expect allow until 20, deny on 21st)",
  );
  for (let i = 1; i <= 21; i++) {
    const res = limiter.allowRequest("premiumUser");
    if (i <= 3 || i >= 19) {
      console.log(
        `premiumUser req#${i}: allowed=${res.allowed}, remaining=${res.remaining}, retryAfterMs=${res.retryAfterMs ?? 0}`,
      );
    }
    if (i === 3) console.log("...");
  }
}

const algorithms: RateLimitAlgorithmType[] = [
  RateLimitAlgorithmType.FIXED_WINDOW_COUNTER,
  RateLimitAlgorithmType.SLIDING_WINDOW_LOG,
  RateLimitAlgorithmType.SLIDING_WINDOW_COUNTER,
  RateLimitAlgorithmType.TOKEN_BUCKET,
  RateLimitAlgorithmType.LEAKY_BUCKET,
];

for (const algo of algorithms) {
  runBurstTest(algo);
}
