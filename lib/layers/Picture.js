import Canvas from '../Canvas'
import { Rectangle } from '../geometry/Rectangle';
import { Point } from '../geometry/Point';

const symbols = {
  x: Symbol('x'),
  y: Symbol('y')
};

class Picture {
  constructor(x, y, image) {
    this.rotatable = true;
    this.resizable = true;
    this.data = image;
    this[symbols.x] = x;
    this[symbols.y] = y;
    this.calc();
  }
  get type() {
    return 'picture';
  }
  get x() {
    return this[symbols.x];
  }
  get y() {
    return this[symbols.y];
  }
  get width() {
    return this.data.width;
  }
  get height() {
    return this.data.height;
  }
  select(event) {
    const index = ((event.y - this.y) * this.width + event.x - this.x) * 4 + 3;
    const alpha = this.pixels[index];
    return Boolean(alpha);
  }
  resize(direction, event) {
    if (direction == 'rb') {
      this.data.width = event.x - this.x;
      this.data.height = event.y - this.y;
    } else if ( direction == 'lb') {
      this.data.width = this.width + this.x - event.x;
      this.data.height = event.y - this.y;
      this[symbols.x] = event.x;
    } else if (direction == 'rt') {
      this.data.width = event.x - this.x;
      this.data.height = this.height + this.y - event.y;
      this[symbols.y] = event.y;
    } else if (direction == 'lt') {
      this.data.width = this.width + this.x - event.x;
      this.data.height = this.height + this.y - event.y;
      this[symbols.x] = event.x;
      this[symbols.y] = event.y;
    }
    this.calc();
  }
  draw(context) {
    context.drawImage(this.data, this.x, this.y, this.width, this.height);
  }
  move(x, y) {
    this[symbols.x] += x;
    this[symbols.y] += y;
  } 
  calc() {
    const canvas = new Canvas(this.width, this.height);
    const context = canvas.getContext();
    context.drawImage(this.data, 0, 0, this.width, this.height);
    const { data } = context.getImageData(0, 0, this.width, this.height);
    this.pixels = data;
  }
  async picture() {
    return this
  }
  // specific
  get src() {
    return this.data.src;
  }
  static normalize(image, { width, height }) {
    if (image.width > width || image.height > height) {
      const correlation = width / height;
      if (correlation > 1) {
        image.width = height * (image.width / image.height);
        image.height = height;
      } else if (correlation < 1) {
        image.height = width / (image.width / image.height);
        image.width = width;
      } else {
        image.width = image.height = Math.min(width, height);
      }
    }
    return image;
  }
  static load(src) {
    return new Promise(resolve => {
      const image = new Image();
      image.src = src;
      image.onload = function() {
        resolve(image);
      };
    });
  }
}

export default Picture;
