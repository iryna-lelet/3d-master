export class History {
  constructor(context) {
    this.context = context;
    this.list = [];
    this.cursor = -1;
  }
  get length() {
    return this.list.length;
  }
  save(event) {
    this.cursor += 1;
    this.list.splice(this.cursor, this.length - this.cursor, event);
  }
  undo() {
    if (this.cursor >= 0) {
      this.list[this.cursor--].down.apply(this.context);
    }
  }
  redo() {
    if (this.cursor < this.length - 1) {
      this.list[++this.cursor].up.apply(this.context);
    }
  }
}

export class Event {
  constructor({ up, down }) {
    this.up = up;
    this.down = down;
  }
}