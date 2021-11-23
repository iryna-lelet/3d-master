import _ from 'lodash'
import Layer from './Layer'
import Line from './layers/Line'
import Text from './layers/Text'
import Picture from './layers/Picture'
import Canvas from './Canvas'
import { History, Event } from './History'
import { List } from './List'
import { setTimeout } from 'timers';

class Drawer {
  constructor(canvas, { width = 100, height = 100, scale = 2 } = {}) {
    this.scale = scale;
    canvas.width = width * scale;
    canvas.height = height * scale;
    this.context = canvas.getContext('2d');
    this.context.lineWidth = 2,
    this.context.lineCap = 'round',
    this.context.lineJoin = 'round',
    this.context.textBaseline = 'ideographic';
    this.context.imageSmoothingQuality = 'high';
    // this.context.rotate(45 * Math.PI / 180);
    this.layers = new List();
    this.history = new History(this);
  }
  get line() {
    const context = this.context;
    return {
      set width(width) {
        context.lineWidth = width;
      },
      get width() {
        return context.lineWidth;
      },
      set color(style) {
        context.strokeStyle = style;
      },
      get color() {
        return context.strokeStyle;
      },
      set join(join) {
        context.lineJoin = join;
      },
      set smoothing(smoothing) {
        context.imageSmoothingQuality = smoothing;
      },
      set cap(cap) {
        context.lineCap = cap;
      }
    };
  }
  set line(line) {
    for (let prop in line) {
      this.line[prop] = line[prop];
    }
  }
  get canvas() {
    return this.context.canvas
  }
  get source() {
    const clone = Canvas.clone(this.context);
    this.layers.forEachRight(layer => layer.draw(clone));
    return clone.canvas.toDataURL();
  }
  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  get helpers() {
    const self = this;
    const { context, scale } = this;
    return {
      *draw(x, y, { style }) {
        const line = new Line(x * scale, y * scale, style);
        const layer = new Layer(line, { name: 'New Line' });
        self.add(layer);
        let cord = yield;
        while (cord) {
          layer.add({ x: (cord.x - x) * scale, y: (cord.y - y) * scale });
          //layer.calc();
          self.redraw();
          cord = yield;
        }
      },
      *text (x, y, { style }) {
        let string = yield;
        const text = new Text(x * scale, y * scale, style);
        const layer = new Layer(text, {
          name: string
        });
        self.add(layer);
        while (string != 'Enter') {
          if (string == 'Backspace') {
            text.remove(1);
          } else {
            layer.add(string);
          }
          self.layers.get(0).name = text.data;
          self.redraw();
          string = yield;
        }
      },
      *move(x, y) {
        const layer = self.select(x, y);
        if (layer) {
          const old = { x: layer.x, y: layer.y };
          let cord = yield;
          while (cord) {
            self.move(layer, cord.x - x, cord.y - y);
            x = cord.x;
            y = cord.y;
            cord = yield;
            self.redraw();
          }
          const current = { x: layer.x, y: layer.y };
          self.history.save(new Event({
            up() {
              layer.x = current.x;
              layer.y = current.y;
            },
            down() {
              layer.x = old.x;
              layer.y = old.y;
            }
          }));
        }
      },
      *resize(x, y) {
        const point = self.point(x, y);
        if (point && point != 'rotate') {
          const width = self.focused.width;
          const height = self.focused.height;
          let cord = yield;
          while (cord) {
            self.resize(point, cord.x, cord.y);
            x = cord.x;
            y = cord.y;
            cord = yield;
            self.redraw();
          }
          self.focused.calc(context, width, height);
        }
      },
      *rotate(x, y) {
        const point = self.point(x, y);
        if (point === 'rotate') {
          let cord = yield;
          while (cord) {
            self.focused.rotate(cord.x * scale, cord.y * scale);
            x = cord.x;
            cord = yield;
            self.redraw();
          }
          //self.focused.calc();
        }
      },
      *hover(x, y) {
        let cord = yield;
        while (cord) {
          self.hover = self.select(cord.x, cord.y);
          self.redraw();
          cord = yield;
        }
      }
    };
  }
  select(x, y) {
    x *= this.scale;
    y *= this.scale;
    if (this.focused && this.focused.select(x, y)) {
      return this.focused;
    }
    return this.layers.find(layer => layer.select(x, y, 'deep'));
  }
  layer(x, y) {
    x *= this.scale;
    y *= this.scale;
    return this.layers.findIndex(layer => layer.select(x, y, 'deep'));
  }
  move(layer, x, y) {
    layer.move(x * this.scale, y * this.scale);
  }
  point(x, y) {
    return this.focused.point(x * this.scale, y * this.scale);
  }
  focus(index) {
    this.focused = this.layers.get(index);
    this.redraw();
    return this.focused;
  }
  defocus() {
    this.focused = null;
    this.redraw();
  }
  resize(point, x, y) {
    this.focused.resize(point, x * this.scale, y * this.scale);
  }
  raise(index) {
    this.layers.swap(index - 1, index);
    this.redraw();
  }
  lower(index) {
    this.layers.swap(index, index + 1);
    this.redraw();
  }
  add(layer) {
    this.layers.unshift(layer);
    //layer.calc();
    this.redraw();
  }
  remove(index) {
    const layer = this.layers.remove(index);
    if (this.focused == layer) { 
      this.focused = null;
    }
    if (this.hover == layer) { 
      this.hover = null;
    }
    this.redraw();
  }
  drop() {
    this.layers.drop();
    this.focused = null;
    this.redraw();
  }
  undo() {
    this.history.undo();
    this.redraw();
  }
  redo() {
    this.history.redo();
    this.redraw();
  }
  async conversion(index) {
    await this.layers.get(index).conversion();
    this.redraw();
  }
  async upload(file) {
    const src = URL.createObjectURL(file);
    const image = await Picture.load(src);
    const picture = new Picture(0, 0, Picture.normalize(image, { width: this.width, height: this.height }));
    const layer = new Layer(picture, {
      name: file.name.slice(0, file.name.lastIndexOf('.'))
    });
    this.add(layer);
    this.history.save(new Event({
      up() {
        this.layers.unshift(layer);
      },
      down() {
        this.layers.shift();
      }
    }));
  }
  async redraw() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.layers.forEachRight(layer => {
      layer.draw(this.context)
    });
    if (this.focused) {
      this.focused.frame(this.context);
    } else if (this.hover) {
      this.hover.hover(this.context);
    }
  }
}

export default Drawer;
