export function toRC(index: number, gridSize: number) {
  return { r: Math.floor(index / gridSize), c: index % gridSize };
}

export function toIndex(r: number, c: number, gridSize: number) {
  return r * gridSize + c;
}

export function isAdjacent(aIdx: number, bIdx: number, gridSize: number): boolean {
  const a = toRC(aIdx, gridSize);
  const b = toRC(bIdx, gridSize);
  const dr = Math.abs(a.r - b.r);
  const dc = Math.abs(a.c - b.c);
  return dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0);
}
