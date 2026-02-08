import { VehicleType } from "./enums";
import { Vehicle } from "./vehicle";

export class ParkingSpot {
  // we can even store just a boolean variable
  // instead of full Vehicle object

  private occupiedVehicle: Vehicle | null = null;
  constructor(
    public readonly spotId: string,
    public readonly supportedVehicleType: VehicleType,
  ) {}

  public isAvailable(): boolean {
    return this.occupiedVehicle === null;
  }

  public occupy(vehicle: Vehicle): void {
    this.occupiedVehicle = vehicle;
  }

  public release(): void {
    this.occupiedVehicle = null;
  }
}
