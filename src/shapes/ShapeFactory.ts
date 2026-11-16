import { CONFIG } from '../core/Config';
import { polygonArea } from '../utils/geometry';
import { hslToHex, randInt, randRange } from '../utils/random';

export interface ShapeSpec {
  /** Flat polygon points, centred around (0,0). */
  points: number[];
  /** Bounding radius (all vertices are within this distance of the origin). */
  radius: number;
  color: number;
  /** Polygon area in px². */
  area: number;
}

/**
 * Factory: builds random irregular shapes.
 * Vertices are placed at sorted random angles with random radii, which always
 * yields a simple (non self-intersecting), star-shaped polygon.
 */
export class ShapeFactory {
  create(): ShapeSpec {
    const { minRadius, maxRadius, minSides, maxSides } = CONFIG.shape;
    const radius = randRange(minRadius, maxRadius);
    const sides = randInt(minSides, maxSides);

    const angles: number[] = [];
    for (let i = 0; i < sides; i++) angles.push(randRange(0, Math.PI * 2));
    angles.sort((a, b) => a - b);

    const points: number[] = [];
    for (const a of angles) {
      const r = radius * randRange(0.45, 1);
      points.push(Math.cos(a) * r, Math.sin(a) * r);
    }

    return {
      points,
      radius,
      color: hslToHex(randRange(0, 360), randRange(0.6, 0.9), randRange(0.5, 0.65)),
      area: polygonArea(points),
    };
  }
}
