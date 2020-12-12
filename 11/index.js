const { shallowEqual, hrtime } = require("../util")

const EMPTY = "L"
const OCCUPIED = "#"

class Floor {
  constructor(lines) {
    this.rows = lines.length
    this.cols = lines[0].length

    this.spaces = lines.reduce(
      (acc, line, y) =>
        line
          .split("")
          .reduce((acc2, p, x) => ((acc2[`${x}-${y}`] = p), acc2), acc),
      {}
    )

    this.deltas = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ]
  }

  run(...args) {
    let next = null
    while (!shallowEqual(this.spaces, (next = this.getNextSpaces(...args)))) {
      this.spaces = next
    }
    return this
  }

  getNextSpaces(toBecomeEmptyCount = 4, strategy = "adjacent") {
    //const endTimer = hrtime()

    const result = Object.entries(this.spaces).reduce((acc, [key, space]) => {
      const [x, y] = key.split("-").map(Number)

      const occupied = this.deltas
        .map((delta) => this[strategy](x, y, ...delta))
        .filter((s) => s === OCCUPIED).length

      acc[key] =
        space === EMPTY && occupied === 0
          ? OCCUPIED
          : space === OCCUPIED && occupied >= toBecomeEmptyCount
          ? EMPTY
          : space

      return acc
    }, {})

    //console.log(endTimer().ms.toFixed(3))

    return result
  }

  adjacent(x, y, deltaX, deltaY) {
    return this.spaces[`${x + deltaX}-${y + deltaY}`]
  }

  firstVisible(x, y, deltaX, deltaY) {
    while (x >= 0 && y >= 0 && x <= this.cols && y <= this.rows) {
      const cell = this.adjacent(x, y, deltaX, deltaY)
      if (cell === OCCUPIED || cell === EMPTY) {
        return cell
      }
      x += deltaX
      y += deltaY
    }
  }

  countOccupied() {
    return Object.values(this.spaces).filter((s) => s === OCCUPIED).length
  }
}

const problem1 = (lines) => {
  return new Floor(lines).run().countOccupied()
}

const problem2 = (lines) => {
  return new Floor(lines).run(5, "firstVisible").countOccupied()
}

module.exports = [problem1, problem2]
