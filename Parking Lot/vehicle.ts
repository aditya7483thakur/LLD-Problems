import { VehicleType } from "./enums";

export class Vehicle {
  constructor(
    public readonly vehicleNumber: string,
    public readonly type: VehicleType,
  ) {}
}
