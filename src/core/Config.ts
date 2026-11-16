export const CONFIG = {
  rate: { initial: 1, min: 1, max: 20, step: 1 }, // shapes / second
  gravity: { initial: 5, min: 1, max: 30, step: 1 },
  // px/s² per gravity unit 
  gravityScale: 40,
  shape: { minRadius: 22, maxRadius: 48, minSides: 5, maxSides: 10 },
  // Max simulation step, protects against huge jumps after a tab was hidden 
  maxDeltaSec: 0.1,
  // HUD refresh interval (ms). DOM is only touched when values change 
  hudIntervalMs: 100,
} as const;
