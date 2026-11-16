import { App } from './core/App';
import { CONFIG } from './core/Config';
import { Settings } from './state/Settings';
import { Hud } from './ui/Hud';
import { StepperControl } from './ui/StepperControl';

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing #${id}`);
  return node as T;
}

const settings = new Settings();
const hud = new Hud(el('hud-count'), el('hud-area'));

const controls = el('controls');
new StepperControl(controls, settings.rate, {
  label: 'Number of shapes per second',
  ...CONFIG.rate,
});
new StepperControl(controls, settings.gravity, {
  label: 'Gravity value',
  ...CONFIG.gravity,
});

const app = new App(el('canvas-host'), settings, hud);
app.start().catch((err) => console.error('Failed to start', err));

// Release GPU/memory resources if the page is torn down (e.g. HMR)
if (import.meta.hot) import.meta.hot.dispose(() => app.destroy());
