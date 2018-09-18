class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  toScreenX() {
    return map(this.x, -1, 1, 0, width)
  }

  toScreenY() {
    return map(this.y, -1, 1, height, 0)
  }

  draw() {
    ellipse(this.toScreenX(), this.toScreenY(), 8, 8)
  }

  static createRandom() {
    return new Point(random(-1, 1), random(-1, 1))
  }
}

class K extends Point {
  constructor(x, y) {
    super(x, y)

    this.color = color(
      'hsb(' + Math.floor(Math.random() * 360) + ', 100%, 100%)'
    )

    this.points = []
  }

  static createRandom() {
    return new K(Math.random() * 2 - 1, Math.random() * 2 - 1)
  }

  draw() {
    ellipse(this.toScreenX(), this.toScreenY(), 12, 12)
  }

  score() {
    if (this.points.length === 0) {
      return 1
    }

    let sum = 0
    for (let p of this.points) {
      sum += dist(p.x, p.y, this.x, this.y)
    }

    return sum / this.points.length
  }
}
