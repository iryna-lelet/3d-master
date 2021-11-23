export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static from({ x, y }) {
    return new Point(x, y);
  }
  static center({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    return new Point((x1 + x2) / 2, (y1 + y2) / 2);
  }
  get rounded() {
    return { x: Math.round(this.x), y: Math.round(this.y) };
  }
  move(x = 0, y = 0) {
    this.x += x;
    this.y += y;
    return this;
  }
  rotate(angle = 0, center = { x: 0, y: 0 }) {
    const x = this.x - center.x;
    const y = this.y - center.y;
    this.x = (x * Math.cos(angle) - y * Math.sin(angle)) + center.x;
    this.y = (y * Math.cos(angle) + x * Math.sin(angle)) + center.y;
    return this;
  }
  isAround(point, radius) {
    return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2) < radius;
  }
}