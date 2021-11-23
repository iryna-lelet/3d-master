import crypto from 'crypto'
import { Point } from './geometry/Point'
import { Rectangle } from './geometry/Rectangle';

const POINT_SIZE = 20;
const ROTATION_OFFSET = 40;
class Layer {
  constructor(data, { name = 'New Layer', angle = 0 }) {
    this.data = data;
    this.shape = Rectangle.from(data.x, data.y, data.width, data.height, angle);
    this.uid = crypto.randomBytes(32).toString('base64');
    this.name = name;
    this.angle = angle;
  }
  get permissions() {
    return {
      rotatable: this.data.rotatable,
      resizable: this.data.resizable
    };
  }
  get type() {
    return this.data.type;
  }
  get x() {
    return this.data.x;
  }
  get y() {
    return this.data.y;
  }
  get width() {
    return this.data.width;
  }
  get height() {
    return this.data.height;
  }
  get center() {
    return this.shape.center;
  }
  get src() {
    if (this.type == 'picture') {
      return this.data.src;
    }
  }
  select(x, y, mode) {
    const isInside = this.shape.isInside({ x, y });
    if (isInside && mode == 'deep') {
      const event = new Point(x, y).rotate(-this.angle, this.center).rounded;
      return this.data.select(event);
    }
    return isInside;
  }
  point(x, y) {
    if (this.data.resizable) {
      if (this.shape.points.A.isAround({ x, y }, POINT_SIZE)) {
        return 'lt'
      } else if (this.shape.points.B.isAround({ x, y }, POINT_SIZE)) {
        return 'rt'
      } else if (this.shape.points.C.isAround({ x, y }, POINT_SIZE)) {
        return 'rb'
      } else if (this.shape.points.D.isAround({ x, y }, POINT_SIZE)) {
        return 'lb'
      }
    }
    if (this.data.rotatable) {
      const rotate = Point.from(this.center)
        .move(0, this.height / 2 + ROTATION_OFFSET + POINT_SIZE / 2)
        .rotate(this.angle, this.center);
      if (rotate.isAround({ x, y }, POINT_SIZE)) {
        return 'rotate';
      }
    }
  }
  resize(direction, x, y) {
    if (this.permissions.resizable) {
      const event = new Point(x, y).rotate(-this.angle, this.center).rounded;
      this.data.resize(direction, event);
    }
  }
  rotate(x, y) {
    const angle = Math.atan2(y - this.center.y, x - this.center.x) -
      Math.atan2(this.height / 2 + 50, 0);
    this.shape.rotate(angle - this.angle);
    this.angle = angle;
  }
  move(x, y) {
    this.data.move(x, y);
    this.shape.move(x, y);
  }
  draw(context) {
    context.save();
    context.translate(this.center.x, this.center.y);
    context.rotate(this.angle);
    context.translate(-this.center.x, -this.center.y);
    this.data.draw(context);
    context.restore();
  }
  frame(context) {
    context.save();
    context.translate(this.center.x, this.center.y);
    context.rotate(this.angle);
    context.translate(-this.center.x, -this.center.y);
    context.setLineDash([10]);
    context.strokeRect(this.x, this.y, this.width, this.height);
    if (this.permissions.resizable) {
      context.fillRect(this.x - POINT_SIZE / 2, this.y - POINT_SIZE / 2, POINT_SIZE, POINT_SIZE);
      context.fillRect(this.x + this.width - POINT_SIZE / 2, this.y - POINT_SIZE / 2, POINT_SIZE, POINT_SIZE);
      context.fillRect(this.x + this.width - POINT_SIZE / 2, this.y + this.height - POINT_SIZE / 2, POINT_SIZE, POINT_SIZE);
      context.fillRect(this.x - POINT_SIZE / 2, this.y + this.height - POINT_SIZE / 2, POINT_SIZE, POINT_SIZE);
    }
    if (this.permissions.rotatable) {
      context.beginPath();
      context.moveTo(this.x + this.width / 2, this.y + this.height);
      context.lineTo(this.x + this.width / 2, this.y + this.height + ROTATION_OFFSET);
      context.stroke();
      context.closePath();
      context.beginPath();
      context.arc(this.x + this.width / 2, this.y + this.height + ROTATION_OFFSET + POINT_SIZE / 2, POINT_SIZE / 2, 0, 2 * Math.PI);
      context.closePath();
      context.fill();
    }
    context.restore();
    // DECOMMENT to see shape points
    // const { A, B, C, D } = this.shape.points;
    // context.beginPath();
    // context.moveTo(A.x, A.y);
    // context.lineTo(C.x, C.y);
    // context.moveTo(B.x, B.y);
    // context.lineTo(D.x, D.y);
    // context.stroke();
    // context.closePath();
  }
  hover(context) {
    context.save();
    context.translate(this.center.x, this.center.y);
    context.rotate(this.angle);
    context.translate(-this.center.x, -this.center.y);
    context.setLineDash([10]);
    context.strokeStyle = '#409EFF'
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.restore();
  }
  calc(context) {
    this.shape.resize(this.x, this.y, this.width, this.height);
    const replacement = Point.from(this.shape.points.A)
      .rotate(-this.angle, this.center)
      .move(-this.x, -this.y).rounded;
    this.data.move(replacement.x, replacement.y);
  }
  add(data) {
    this.data.add(data);
    this.shape = Rectangle.from(this.x, this.y, this.width, this.height, this.angle);
  }
  async conversion() {
    this.data = await this.data.picture();
  }
}

export default Layer;