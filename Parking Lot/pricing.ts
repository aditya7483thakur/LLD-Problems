import { VehicleType } from "./enums";
import { Ticket } from "./ticket";

export interface PricingStrategy {
  calculateAmount(ticket: Ticket, exitTime: Date): number;
}

export class HourlyPricingStrategy implements PricingStrategy {
  private readonly ratesPerHour: Map<VehicleType, number>;

  constructor() {
    this.ratesPerHour = new Map([
      [VehicleType.TWO_WHEELER, 20],
      [VehicleType.THREE_WHEELER, 30],
      [VehicleType.FOUR_WHEELER, 40],
    ]);
  }

  calculateAmount(ticket: Ticket, exitTime: Date): number {
    const durationInMs = exitTime.getTime() - ticket.entryTime.getTime();

    const hours = Math.ceil(durationInMs / (1000 * 60 * 60));
    const rate = this.ratesPerHour.get(ticket.vehicle.type) ?? 0;

    return hours * rate;
  }
}
