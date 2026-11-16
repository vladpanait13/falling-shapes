import { Application, Container, Graphics, Rectangle } from 'pixi.js';
import { CONFIG } from './Config';
import { ShapeManager } from '../shapes/ShapeManager';
import { Spawner } from '../shapes/Spawner';
import type { Settings } from '../state/Settings';
import type { Hud } from '../ui/Hud';

// Composition root of the simulation: PIXI app, mask, systems and the main loop 
export class App {
  private readonly pixi = new Application();
  private readonly layer = new Container();
  private readonly mask = new Graphics();
  private readonly spawner = new Spawner();
  private readonly shapes = new ShapeManager(this.layer);
  private hudTimer = 0;

  constructor(
    private readonly host: HTMLElement,
    private readonly settings: Settings,
    private readonly hud: Hud,
  ) {}

  async start(): Promise<void> {
    await this.pixi.init({
      resizeTo: this.host,
      background: 0xffffff,
      antialias: true,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2), // cap for mobile GPUs
      powerPreference: 'low-power',
    });
    this.host.appendChild(this.pixi.canvas);

    // Shapes live in `layer`; the mask hides anything outside the rectangle (Fig. 1 - C).
    const stage = this.pixi.stage;
    stage.addChild(this.layer, this.mask);
    this.layer.mask = this.mask;

    // Click / tap on empty space spawns a shape at the pointer (Fig. 1 - D).
    stage.eventMode = 'static';
    stage.on('pointerdown', (e) => this.shapes.spawnAt(e.global.x, e.global.y));

    this.pixi.renderer.on('resize', () => this.onResize());
    this.onResize();

    this.pixi.ticker.add((t) => this.tick(t.deltaMS / 1000, t.deltaMS));
  }

  private onResize(): void {
    const { width, height } = this.pixi.screen;
    this.mask.clear().rect(0, 0, width, height).fill(0xffffff);
    this.pixi.stage.hitArea = new Rectangle(0, 0, width, height);
    this.shapes.resize(width, height);
  }

  private tick(rawDt: number, deltaMs: number): void {
    const dt = Math.min(rawDt, CONFIG.maxDeltaSec);

    this.spawner.update(dt, this.settings.rate.value, () => this.shapes.spawnAtTop());
    const stats = this.shapes.update(dt, this.settings.gravity.value * CONFIG.gravityScale);

    this.hudTimer += deltaMs;
    if (this.hudTimer >= CONFIG.hudIntervalMs) {
      this.hudTimer = 0;
      this.hud.update(stats.count, stats.area);
    }
  }

  destroy(): void {
    this.shapes.destroy();
    this.pixi.destroy(true, { children: true });
  }
}
