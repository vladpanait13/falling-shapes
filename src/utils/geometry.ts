// Area of a simple polygon (flat [x0,y0,x1,y1,...]) using the shoelace formula

export function polygonArea(points: number[]): number {
  let sum = 0;
  const n = points.length;
  for (let i = 0; i < n; i += 2) {
    const j = (i + 2) % n;
    sum += points[i] * points[j + 1] - points[j] * points[i + 1];
  }
  return Math.abs(sum) / 2;
}
