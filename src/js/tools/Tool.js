export default class Tool {
  constructor(name) {
    if (new.target === Tool) {
      throw new TypeError("Cannot construct \"Tool\" instances directly.");
    }

    this.name = name;
  }

  onMouseDown(coords, editor) {
    throw new Error("Method \"onMouseDown\" is an abstract method and must be implemented in a derived class.");
  }

  onMouseMove(coords, editor) {
    return;
  }

  onMouseUp(coords, editor) {
    return;
  }
}