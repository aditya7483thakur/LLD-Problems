import { ParkingFloor } from "./parkingfloor";
import { PricingStrategy } from "./pricing";
import { Ticket } from "./ticket";
import { Vehicle } from "./vehicle";

export class ParkingLot {
  private readonly activeTickets: Map<string, Ticket> = new Map();

  constructor(
    private readonly floors: ParkingFloor[],
    private readonly pricingStrategy: PricingStrategy,
  ) {}

  public parkVehicle(vehicle: Vehicle): Ticket {
    for (const floor of this.floors) {
      if (floor.hasAvailableSpot(vehicle.type)) {
        const spot = floor.findAvailableSpot(vehicle.type);

        if (!spot) continue;

        spot.occupy(vehicle);

        const ticket = new Ticket(
          this.generateTicketId(),
          vehicle,
          spot,
          new Date(),
        );

        this.activeTickets.set(ticket.ticketId, ticket);
        return ticket;
      }
    }
    throw new Error("No parking spot available");
  }

  public unparkVehicle(ticketId: string): number {
    const ticket = this.activeTickets.get(ticketId);
    if (!ticket) throw new Error("Invalid Ticket");

    ticket.parkingSpot.release();

    const amount = this.pricingStrategy.calculateAmount(ticket, new Date());

    this.activeTickets.delete(ticketId);

    return amount;
  }

  private generateTicketId(): string {
    return Math.random().toString(36).substring(2, 10);
  }
}
