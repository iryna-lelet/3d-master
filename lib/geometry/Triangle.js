import { Point } from './Point'

const points = Symbol('points');


export class Triangle {
  constructor(A, B, C) {
    this[points] = { A, B, C };
  }
  static from(A, B, C) {
    return new Triangle(A, B, C);
  }
  get points() {
    return this[points];
  }
  get area() {
    return Triangle.area(this);
  }
  static area(triangle) {
    const { A, B, C } = triangle.points;
    return 0.5 * Math.abs(A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  }
}