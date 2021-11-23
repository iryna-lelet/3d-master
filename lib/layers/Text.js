import Canvas from '../Canvas'
import { Rectangle } from '../geometry/Rectangle'

const symbols = {
  x: Symbol('x'),
  y: Symbol('y')
};

class Text {
  constructor(x, y, { type, family, size, color}) {
    this.resizable = false;
    this.rotatable = true;
    this.data = '';
    this.style = {
      type: `${type.italic ? 'italic' : ''} ${type.bold ? 'bold' : ''}`,
      family,
      size,
      color
    };
    this[symbols.x] = x;
    this[symbols.y] = y;
  }
  get type() {
    return 'text';
  }
  get x() {
    return this[symbols.x];
  }
  get y() {
    return this[symbols.y] - this.height;
  }
  get width() {
    const context = Canvas.context({
      font: this.font
    });
    const { width } = context.measureText(this.data);
    return width;
  }
  get height() {
    return this.style.size;
  }
  select(event) {
    return true;
  }
  draw(context) {
    context.font = this.font;
    if (this.style.type.stroke) {
      context.strokeText(this.data, this[symbols.x], this[symbols.y]);
    } else {
      context.fillStyle = this.style.color;
      context.fillText(this.data, this[symbols.x], this[symbols.y]);
    }
  }
  move(x, y) {
    this[symbols.x] += x;
    this[symbols.y] += y;
  }
  add(string) {
    this.data += string;
    return { x: 0, y: 0 };
  }
  // specific
  remove(count) {
    this.data = this.data.slice(0, -count);
  }
  get font() {
    return `${this.style.type} ${this.style.size}px ${this.style.family}`;
  }
}

export default Text;
