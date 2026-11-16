import type { Observable } from '../state/Observable';
import { clamp } from '../utils/random';

export interface StepperOptions {
  label: string;
  min: number;
  max: number;
  step: number;
}

// "−  +" control bound to an Observable<number>

export class StepperControl {
  private readonly minus: HTMLButtonElement;
  private readonly plus: HTMLButtonElement;
  private readonly output = document.createElement('output');
  private readonly unsubscribe: () => void;

  constructor(
    parent: HTMLElement,
    private readonly model: Observable<number>,
    private readonly opts: StepperOptions,
  ) {
    this.minus = this.button('−', 'Decrease');
    this.plus = this.button('+', 'Increase');

    const root = document.createElement('div');
    root.className = 'stepper';

    const buttons = document.createElement('div');
    buttons.className = 'stepper__buttons';
    buttons.append(this.minus, this.plus);

    const label = document.createElement('div');
    label.className = 'stepper__label';
    label.append(`${opts.label}: `, this.output);

    root.append(buttons, label);
    parent.append(root);

    this.minus.addEventListener('click', () => this.change(-opts.step));
    this.plus.addEventListener('click', () => this.change(opts.step));
    this.unsubscribe = model.subscribe((v) => this.render(v));
  }

  private button(text: string, aria: string): HTMLButtonElement {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'stepper__btn';
    b.textContent = text;
    b.setAttribute('aria-label', aria);
    return b;
  }

  private change(delta: number): void {
    this.model.set(clamp(this.model.value + delta, this.opts.min, this.opts.max));
  }

  private render(v: number): void {
    this.output.textContent = String(v);
    this.minus.disabled = v <= this.opts.min;
    this.plus.disabled = v >= this.opts.max;
  }

  destroy(): void {
    this.unsubscribe();
  }
}
