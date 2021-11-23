class Node {
  constructor(data, { prev, next } = {}) {
    this.data = data;
    this.next = next;
    this.prev = prev;
  }
}

const head = Symbol('head');
const tail = Symbol('tail');
const length = Symbol('length');
const getNode = Symbol('getNode');

export class List {
  constructor() {
    this[head] = new Node();
    this[tail] = new Node(); 
    this[head].next = this[tail];
    this[tail].prev = this[head];
    this[length] = 0;
    this.observable = 0;
  }
  get length() {
    return this[length];
  }
  get isEmpty() {
    return this[length] <= 0;
  }
  get array() {
    const array = [];
    for (let data of this) {
      array.push(data);
    }
    return array;
  }
  *[Symbol.iterator]() {
    let temp = this[head].next;
    while (temp != this[tail]) {
      yield temp.data;
      temp = temp.next;
    }
  }
  emit() {
    this.observable += 1; 
  }
  push(data) {
    const node = new Node(data, {
      prev: this[tail].prev,
      next: this[tail]
    });
    this[tail].prev = node;
    node.prev.next = node; 
    this[length] += 1;
    this.emit();
  }
  unshift(data) {
    const node = new Node(data, {
      prev: this[head],
      next: this[head].next
    });
    this[head].next = node;
    node.next.prev = node;
    this[length] += 1;
    this.emit();
  }
  add(data, index) {
    const temp = this[getNode](index);
    const node = new Node(data, {
      prev: temp.prev,
      next: temp
    });
    temp.prev = node;
    node.prev.next = node;
    this[length] += 1;
    this.emit();
  }
  pop() {
    if (!this.isEmpty) {
      const removed = this[tail].prev;
      this[tail].prev = removed.prev;
      removed.next = this[tail];
      this[length] -= 1;
      this.emit();
      return removed.data;
    } else {
      throw new Error('List is empty!');
    }
  }
  shift() {
    if (!this.isEmpty) {
      const removed = this[head].next;
      this[head].next = removed.next;
      removed.next.prev = this[head];
      this[length] -= 1;
      this.emit();
      return removed.data;
    } else {
      throw new Error('List is empty!');
    }
  }
  remove(index) {
    const removed = this[getNode](index);
    removed.next.prev = removed.prev;
    removed.prev.next = removed.next;
    this[length] -= 1;
    this.emit();
    return removed.data;
  }
  drop() {
    this[head].next = this[tail];
    this[tail].prev = this[head];
    this.emit();
  }
  forEach(callback) {
    let temp = this[head].next;
    let index = 0;
    while (temp != this[tail]) {
      callback(temp.data, index);
      temp = temp.next;
      index += 1;
    }
  }
  forEachRight(callback) {
    let temp = this[tail].prev;
    let index = this[length] - 1;
    while (temp != this[head]) {
      callback(temp.data, index);
      temp = temp.prev;
      index -= 1;
    }
  }
  find(callback) {
    let temp = this[head].next;
    let index = 0;
    while (temp != this[tail]) {
      if (callback(temp.data, index)) {
        return temp.data;
      }
      temp = temp.next;
      index += 1;
    }
  }
  findIndex(callback) {
    let temp = this[head].next;
    let index = 0;
    while (temp != this[tail]) {
      if (callback(temp.data, index)) {
        return index;
      }
      temp = temp.next;
      index += 1;
    }
  }
  [getNode](index) {
    if (index >= 0 && index <= this[length]) {
      let temp = this[head].next;
      while (index--) {
        temp = temp.next;
      }
      return temp;
    } else {
      throw new Error('Index is out of range!');
    }
  }
  get(index) {
    return this[getNode](index).data;
  }
  swap(first, second) {
    first = this[getNode](first);
    second = this[getNode](second);
    [second.data, first.data] = [first.data, second.data];
    this.emit();
  }
}