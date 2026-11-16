//Time-based emitter: calls `emit` `rate` times per second, frame-rate independent

export class Spawner {
  private accumulator = 0;

  update(dtSec: number, rate: number, emit: () => void): void {
    this.accumulator += dtSec;
    const interval = 1 / rate;
    while (this.accumulator >= interval) {
      this.accumulator -= interval;
      emit();
    }
  }

  reset(): void {
    this.accumulator = 0;
  }
}
