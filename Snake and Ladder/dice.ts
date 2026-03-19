export class Dice {
  constructor(private readonly minValue: number = 1, private readonly maxValue: number = 6) {
    if (minValue >= maxValue) {
      throw new Error("Invalid dice range: minValue should be less than maxValue");
    }
  }

  roll(): number {
    return (
      Math.floor(Math.random() * (this.maxValue - this.minValue + 1)) +
      this.minValue
    );
  }
}
