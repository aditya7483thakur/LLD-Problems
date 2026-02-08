import { VehicleType } from "./enums";
import { ParkingFloor } from "./parkingfloor";
import { ParkingLot } from "./parkinglot";
import { ParkingSpot } from "./parkingspot";
import { HourlyPricingStrategy } from "./pricing";
import { Vehicle } from "./vehicle";

// Create parking spots for Floor 1
const floor1Spots: ParkingSpot[] = [
  new ParkingSpot("F1-S1", VehicleType.TWO_WHEELER),
  new ParkingSpot("F1-S2", VehicleType.TWO_WHEELER),
  new ParkingSpot("F1-S3", VehicleType.FOUR_WHEELER),
  new ParkingSpot("F1-S4", VehicleType.FOUR_WHEELER),
];

// Create parking spots for Floor 2
const floor2Spots: ParkingSpot[] = [
  new ParkingSpot("F2-S1", VehicleType.THREE_WHEELER),
  new ParkingSpot("F2-S2", VehicleType.FOUR_WHEELER),
  new ParkingSpot("F2-S3", VehicleType.FOUR_WHEELER),
];

// Create floors
const floor1 = new ParkingFloor(1, floor1Spots);
const floor2 = new ParkingFloor(2, floor2Spots);

// Create parking lot with hourly pricing
const parkingLot = new ParkingLot(
  [floor1, floor2],
  new HourlyPricingStrategy(),
);

console.log("=== Parking Lot Demo ===\n");

// Park some vehicles
const bike = new Vehicle("KA-01-1234", VehicleType.TWO_WHEELER);
const car1 = new Vehicle("MH-02-5678", VehicleType.FOUR_WHEELER);
const auto = new Vehicle("DL-03-9999", VehicleType.THREE_WHEELER);

console.log("Parking vehicles...\n");

const bikeTicket = parkingLot.parkVehicle(bike);
console.log(
  `Parked ${bike.vehicleNumber} (Two Wheeler) - Ticket: ${bikeTicket.ticketId}`,
);

const carTicket = parkingLot.parkVehicle(car1);
console.log(
  `Parked ${car1.vehicleNumber} (Four Wheeler) - Ticket: ${carTicket.ticketId}`,
);

const autoTicket = parkingLot.parkVehicle(auto);
console.log(
  `Parked ${auto.vehicleNumber} (Three Wheeler) - Ticket: ${autoTicket.ticketId}`,
);

// Simulate time passing (for demo, charges will be minimal since exit is immediate)
console.log("\n--- Simulating exit ---\n");

let p = new Promise<void>((resolve) => {
  setTimeout(() => {
    resolve();
  }, 5000);
});

async function run() {
  console.log("Before");
  await p; // ⏸️ actual delay
  console.log("After");

  // Unpark vehicles AFTER delay
  const bikeCharge = parkingLot.unparkVehicle(bikeTicket.ticketId);
  console.log(`Unparked ${bike.vehicleNumber} - Charge: Rs.${bikeCharge}`);

  const carCharge = parkingLot.unparkVehicle(carTicket.ticketId);
  console.log(`Unparked ${car1.vehicleNumber} - Charge: Rs.${carCharge}`);

  const autoCharge = parkingLot.unparkVehicle(autoTicket.ticketId);
  console.log(`Unparked ${auto.vehicleNumber} - Charge: Rs.${autoCharge}`);

  console.log("\n=== Demo Complete ===");
}

run();

// Demo: Try parking when no spot available
console.log("\n--- Testing full parking scenario ---\n");

// Fill up remaining two-wheeler spot (bike already in F1-S1)
const bike2 = new Vehicle("TN-04-1111", VehicleType.TWO_WHEELER);
const bike3 = new Vehicle("AP-05-2222", VehicleType.TWO_WHEELER);

parkingLot.parkVehicle(bike2);
console.log(`Parked ${bike2.vehicleNumber}`);

// Now both two-wheeler spots are full (bike + bike2)
try {
  parkingLot.parkVehicle(bike3);
} catch (error) {
  console.log(
    `Failed to park ${bike3.vehicleNumber}: ${(error as Error).message}`,
  );
}
