export class Boundary {
  static width = 48
  static height = 48
  constructor({ position, type }) {
    this.position = position
    this.width = 48
    this.height = 48
    this.type = type
  }

  draw() {
    if (this.type === 'battle') {
      c.fillStyle = 'rgba(255, 0, 0, 0.5)'
      c.fillRect(this.position.x, this.position.y, this.width, this.height)
      c.fillStyle = 'rgba(0, 0, 0, 1.0)'
    }
  }
}
