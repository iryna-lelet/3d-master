import _ from 'lodash'

class Canvas {
  constructor(width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
  }
  getContext() {
    return this.canvas.getContext('2d');
  }
  toDataURL() {
    return this.canvas.toDataURL();
  }
  static context({ size, ...options }) {
    const canvas = document.createElement('canvas');
    if (size) {
      canvas.width = size.width;
      canvas.height = size.height;
    }
    const context = canvas.getContext('2d');
    context.lineCap = 'round',
    context.lineJoin = 'round',
    context.textBaseline = 'ideographic';
    context.imageSmoothingQuality = 'high';
    for (let option in options) {
      context[option] = options[option];
    }
    return context;
  }
  static clone(context) {
    const canvas = new Canvas(context.canvas.width, context.canvas.height);
    const clone = canvas.getContext();
    clone.lineWidth = context.lineWidth;
    clone.strokeStyle = context.strokeStyle;
    clone.imageSmoothingQuality = context.imageSmoothingQuality;
    clone.lineJoin = context.lineJoin;
    clone.lineCap = context.lineCap;
    clone.font = context.font;
    return clone;
  }
} 

export default Canvas;