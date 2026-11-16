import { Shape } from './Shape';

// Object pool: avoids per-shape allocations / GC spikes 

export class ShapePool {
  private readonly free: Shape[] = [];

  acquire(): Shape {
    return this.free.pop() ?? new Shape();
  }

  release(shape: Shape): void {
    shape.release();
    this.free.push(shape);
  }

  destroy(): void {
    this.free.forEach((s) => s.destroy());
    this.free.length = 0;
  }
}
