import { UserTier } from "./enums";
import { UserTierProvider } from "./types";

export class InMemoryUserTierStore implements UserTierProvider {
  private readonly tiers = new Map<string, UserTier>();

  public setTier(userId: string, tier: UserTier): void {
    this.tiers.set(userId, tier);
  }

  public getTier(userId: string): UserTier {
    return this.tiers.get(userId) ?? UserTier.FREE;
  }
}
