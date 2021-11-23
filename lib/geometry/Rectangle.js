import { Point } from './Point'
import { Triangle } from './Triangle';

const symbols = {
  points: Symbol('points'),
  angle: Symbol('angle'),
  center: Symbol('center'),
  width: Symbol('width'),
  height: Symbol('height')
}

export class Rectangle {
  constructor(x, y, width, height, angle) {
    this[symbols.center] = new Point(x + width / 2, y + height / 2);
    this[symbols.points] = {
      A: new Point(x, y).rotate(angle, this.center),
      B: new Point(x + width, y).rotate(angle, this.center),
      C: new Point(x + width, y + height).rotate(angle, this.center),
      D: new Point(x, y + height).rotate(angle, this.center)
    };
    this[symbols.angle] = angle;
    this[symbols.width] = width;
    this[symbols.height] = height;
  }
  static from(x, y, width, height, angle) {
    return new Rectangle(x, y, width, height, angle);
  }
  get width() {
    return this[symbols.width];
  }
  get height() {
    return this[symbols.height];
  }
  get center() {
    return this[symbols.center];
  }
  get angle() {
    return this[symbols.angle];
  }
  get points() {
    return this[symbols.points];
  }
  get area() {
    return Rectangle.area(this);
  }
  rotate(angle) {
    this.points.A.rotate(angle, this.center);
    this.points.B.rotate(angle, this.center);
    this.points.C.rotate(angle, this.center);
    this.points.D.rotate(angle, this.center);
    this[symbols.angle] += angle;
  }
  move(x, y) {
    this.points.A.move(x, y);
    this.points.B.move(x, y);
    this.points.C.move(x, y);
    this.points.D.move(x, y);
    this[symbols.center].move(x, y);
  }
  resize(x, y, width, height) {
    this.points.A = new Point(x, y).rotate(this.angle, this.center);
    this.points.B = new Point(x + width, y).rotate(this.angle, this.center);
    this.points.C = new Point(x + width, y + height).rotate(this.angle, this.center);
    this.points.D = new Point(x, y + height).rotate(this.angle, this.center);
    this[symbols.width] = width;
    this[symbols.height] = height;
    this[symbols.center] = Point.center(this.points.A, this.points.C);
  }
  isInside(point) {
    const ABP = new Triangle(this.points.A, this.points.B, point);
    const BCP = new Triangle(this.points.B, this.points.C, point);
    const CDP = new Triangle(this.points.C, this.points.D, point);
    const DAP = new Triangle(this.points.D, this.points.A, point);
    const epsilon = 0.0000001;
    return Math.abs(this.area - (ABP.area + BCP.area + CDP.area + DAP.area)) < epsilon;
  }
  static area(rectangle) {
    const { A, B, C, D } = rectangle.points;
    return 0.5 * Math.abs((A.y - C.y) * (D.x - B.x) + (B.y - D.y) * (A.x - C.x));
  }
  static draw(context, style = 'fill') {
    
  }
}