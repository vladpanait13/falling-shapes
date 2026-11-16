import { Container } from 'pixi.js';
import { Shape } from './Shape';
import { ShapeFactory, type ShapeSpec } from './ShapeFactory';
import { ShapePool } from './ShapePool';
import { randRange } from '../utils/random';

export interface Stats {
  count: number;
  area: number;
}

// Owns every live shape: spawning, simulation, removal and stats

export class ShapeManager {
  private readonly active: Shape[] = [];
  private readonly pool = new ShapePool();
  private readonly factory = new ShapeFactory();
  private width = 0;
  private height = 0;

  // Reused each frame to avoid allocating a stats object 
  readonly stats: Stats = { count: 0, area: 0 };

  constructor(private readonly layer: Container) {}

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  // Spawn above the top edge at a random X (Fig. 1 - A)
  spawnAtTop(): void {
    const spec = this.factory.create();
    const x = randRange(spec.radius, Math.max(spec.radius + 1, this.width - spec.radius));
    this.add(spec, x, -spec.radius - 1);
  }

  // Spawn at a given position, e.g. mouse/touch (Fig. 1 - D) 
  spawnAt(x: number, y: number): void {
    this.add(this.factory.create(), x, y);
  }

  private add(spec: ShapeSpec, x: number, y: number): void {
    const shape = this.pool.acquire();
    shape.reset(spec, x, y);
    shape.onPress = (s) => this.remove(s);
    this.layer.addChild(shape.view);
    this.active.push(shape);
  }

  private remove(shape: Shape): void {
    const i = this.active.indexOf(shape);
    if (i !== -1) this.removeAt(i);
  }

  // Swap-remove: O(1), keeps the array dense 
  private removeAt(i: number): void {
    const shape = this.active[i];
    this.active[i] = this.active[this.active.length - 1];
    this.active.pop();
    shape.onPress = null;
    this.pool.release(shape);
  }

  update(dtSec: number, accel: number): Stats {
    let count = 0;
    let area = 0;

    for (let i = this.active.length - 1; i >= 0; i--) {
      const s = this.active[i];
      s.update(dtSec, accel);

      // Fully below the rectangle -> recycle (Fig. 1 - B)
      if (s.y - s.radius > this.height) {
        this.removeAt(i);
        continue;
      }
      // Count only shapes at least partially inside the rectangle
      if (s.y + s.radius > 0) {
        count++;
        area += s.area;
      }
    }

    this.stats.count = count;
    this.stats.area = area;
    return this.stats;
  }

  destroy(): void {
    this.active.forEach((s) => s.destroy());
    this.active.length = 0;
    this.pool.destroy();
  }
}
