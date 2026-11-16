// HTML text fields: number of shapes + occupied surface area

export class Hud {
  private lastCount = -1;
  private lastArea = -1;

  constructor(
    private readonly countEl: HTMLElement,
    private readonly areaEl: HTMLElement,
  ) {}

  // Only writes to the DOM when a value changes

  update(count: number, area: number): void {
    const a = Math.round(area);
    if (count !== this.lastCount) {
      this.lastCount = count;
      this.countEl.textContent = String(count);
    }
    if (a !== this.lastArea) {
      this.lastArea = a;
      this.areaEl.textContent = a.toLocaleString('en-US');
    }
  }
}
