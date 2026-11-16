import { Graphics, Polygon } from 'pixi.js';
import type { ShapeSpec } from './ShapeFactory';

// A single falling shape. Designed to be pooled and reused 
export class Shape {
  readonly view = new Graphics();
  private readonly hit = new Polygon();

  vy = 0;
  radius = 0;
  area = 0;

  // Set by the owner; called when the shape is pressed 
  onPress: ((shape: Shape) => void) | null = null;

  constructor() {
    this.view.eventMode = 'static';
    this.view.cursor = 'pointer';
    this.view.on('pointerdown', (e) => {
      e.stopPropagation(); // don't let the stage spawn a new shape
      this.onPress?.(this);
    });
  }

  get x(): number { return this.view.x; }
  get y(): number { return this.view.y; }
  set y(v: number) { this.view.y = v; }

  // (Re)initialise for a new life 
  reset(spec: ShapeSpec, x: number, y: number): void {
    this.view.clear();
    this.view.poly(spec.points).fill(spec.color).stroke({ width: 2, color: 0x000000 });
    this.hit.points = spec.points;
    this.view.hitArea = this.hit;
    this.view.position.set(x, y);
    this.vy = 0;
    this.radius = spec.radius;
    this.area = spec.area;
    this.view.visible = true;
  }

  //Gravity as constant acceleration (px/s²)
  update(dtSec: number, accel: number): void {
    this.vy += accel * dtSec;
    this.view.y += this.vy * dtSec;
  }

  // Called when returned to the pool 
  release(): void {
    this.view.visible = false;
    this.view.removeFromParent();
    this.view.clear();
  }

  destroy(): void {
    this.onPress = null;
    this.view.destroy();
  }
}
