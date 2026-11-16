# Falling Shapes (PIXI.js + TypeScript)

## Run
    npm install
    npm run dev      # http://localhost:5173
    npm run build    # type-check + production bundle in /dist

## Structure
    src/
      main.ts                 wiring: DOM, settings, controls, app
      styles.css
      core/    App.ts         PIXI app, mask, main loop (composition root)
               Config.ts      all tunable constants
      shapes/  Shape.ts       one falling, poolable shape
               ShapeFactory   Factory: random irregular polygon + colour + area
               ShapePool      Object pool (no GC churn)
               ShapeManager   spawn / simulate / remove / stats
               Spawner        frame-rate independent 1/rate emitter
      state/   Observable.ts  Observer pattern
               Settings.ts    rate + gravity
      ui/      Hud.ts         HTML text fields (shape count, area)
               StepperControl +/- HTML controls
      utils/   random.ts, geometry.ts

## Notes
- Area = sum of polygon areas of shapes at least partly inside the rectangle (overlaps counted twice).
- Gravity is acceleration: px/s² = gravity value x 40.
