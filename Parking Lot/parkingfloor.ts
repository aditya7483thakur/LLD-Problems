import { VehicleType } from "./enums";
import { ParkingSpot } from "./parkingspot";

export class ParkingFloor {
  constructor(
    public readonly floorNumber: number,
    private spots: ParkingSpot[],
  ) {}

  public hasAvailableSpot(vehicleType: VehicleType): boolean {
    return this.spots.some(
      (spot) => spot.supportedVehicleType === vehicleType && spot.isAvailable(),
    );
  }

  public findAvailableSpot(vehicleType: VehicleType): ParkingSpot | null {
    return (
      this.spots.find(
        (spot) =>
          spot.supportedVehicleType === vehicleType && spot.isAvailable(),
      ) || null
    );
  }
}
