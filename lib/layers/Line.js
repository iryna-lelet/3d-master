import Canvas from '../Canvas'
import Picture from './Picture'
import { Rectangle } from '../geometry/Rectangle'

const symbols = {
  x: Symbol('x'),
  y: Symbol('y'),
  width: Symbol('width'),
  height: Symbol('height')
};

export default class Line {
  constructor(x, y, { width, color }) {
    this.rotatable = true;
    this.resizable = false;
    this.style = { width, color };
    this[symbols.x] = x;
    this[symbols.y] = y;
    this.begin = { x, y };
    this.data = [{ x: 1, y: 1 }];
    this[symbols.width] = 1;
    this[symbols.height] = 1;
    this.calc();
  }
  get type() {
    return 'line';
  }
  get x() {
    return this[symbols.x] - this.style.width / 2;
  }
  get y() {
    return this[symbols.y] - this.style.width / 2;
  }
  get width() {
    return this[symbols.width] + this.style.width;
  }
  get height() {
    return this[symbols.height] + this.style.width;
  }
  add({ x, y }) {
    this.data.push({ x, y });
    x += this.begin.x;
    y += this.begin.y;
    if (x < this[symbols.x]) {
      this[symbols.width] += this[symbols.x] - x;
      this[symbols.x] = x;
    } else if (x - this[symbols.x] > this[symbols.width]) {
      this[symbols.width] = x - this[symbols.x];
    }
    if (y < this[symbols.y]) {
      this[symbols.height] += this[symbols.y] - y;
      this[symbols.y] = y;
    } else if (y - this[symbols.y] > this[symbols.height]) {
      this[symbols.height] = y - this[symbols.y];
    }
    this.path.lineTo(x, y);
  }
  select(event) {
    const context = Canvas.context({
      lineWidth: this.style.width
    });
    return context.isPointInStroke(this.path, event.x, event.y);
  }
  draw(context) {
    context.lineWidth = this.style.width;
    context.strokeStyle = this.style.color;
    context.stroke(this.path);
  }
  move(x, y) {
    this[symbols.x] += x;
    this[symbols.y] += y;
    this.begin.x += x;
    this.begin.y += y;
    this.calc();
  }
  calc() {
    this.path = new Path2D();
    this.path.moveTo(this.begin.x, this.begin.y);
    this.data.forEach(point => {
      this.path.lineTo(this.begin.x + point.x, this.begin.y + point.y);
    });
  }
  async picture() {
    const context = Canvas.context({
      size: {
        width: this.width,
        height: this.height,
      },
      lineWidth: this.style.width,
      strokeStyle: this.style.color
    });
    this.begin.x -= this.x;
    this.begin.y -= this.y;
    this.calc();
    context.stroke(this.path);
    const src = context.canvas.toDataURL();
    const image = await Picture.load(src);
    const picture = new Picture(this.x, this.y, image);
    return picture;
  }
}

