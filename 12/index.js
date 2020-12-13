const { wrap, flow, sum } = require("../util")

const parseLines = (lines) =>
  lines.map((d) => {
    const [, action, value] = d.match(/^(N|E|W|S|L|R|F)(\d+)$/)
    return [action, +value]
  })

const yDirs = ["N", "S"]
const xDirs = ["E", "W"]
const directions = [yDirs[0], xDirs[0], yDirs[1], xDirs[1]]

const turn = (heading, action, value) => {
  if (!heading) return heading
  const times = value / (action === "R" ? 90 : -90)
  return directions[wrap(directions, directions.indexOf(heading), times)]
}

const moveHeading = ([x, y, heading], [action, value]) => {
  switch (action) {
    case "N":
      return [x, y + value, heading]
    case "E":
      return [x + value, y, heading]
    case "S":
      return [x, y - value, heading]
    case "W":
      return [x - value, y, heading]
    case "L":
    case "R":
      return [x, y, turn(heading, action, value)]
    case "F":
      return moveHeading([x, y, heading], [heading, value])
    default:
      throw new Error(`Should not reach this ${[x, y, heading, action, value]}`)
  }
}

const rotate = (shipX, shipY, waypointX, waypointY, action, value) => {
  const deltaX = waypointX - shipX
  const deltaY = waypointY - shipY

  const nextHeading1 = turn(
    deltaX > 0 ? "E" : deltaX < 0 ? "W" : null,
    action,
    value
  )
  const nextHeading2 = turn(
    deltaY > 0 ? "N" : deltaY < 0 ? "S" : null,
    action,
    value
  )

  const headingX = xDirs.includes(nextHeading1)
    ? nextHeading1
    : xDirs.includes(nextHeading2)
    ? nextHeading2
    : null

  const headingY = yDirs.includes(nextHeading1)
    ? nextHeading1
    : yDirs.includes(nextHeading2)
    ? nextHeading2
    : null

  const swapDeltas = (value / 90) % 2 === 1

  // These absolute values are the last thing I figured out, took me forever
  const nextDeltaX =
    Math.abs(swapDeltas ? deltaY : deltaX) * (headingX === "E" ? 1 : -1)

  const nextDeltaY =
    Math.abs(swapDeltas ? deltaX : deltaY) * (headingY === "N" ? 1 : -1)

  return [
    [shipX, shipY],
    [shipX + nextDeltaX, shipY + nextDeltaY],
  ]
}

const moveWaypoint = (
  [[shipX, shipY], [waypointX, waypointY]],
  [action, value]
) => {
  switch (action) {
    case "N":
      return [
        [shipX, shipY],
        [waypointX, waypointY + value],
      ]
    case "E":
      return [
        [shipX, shipY],
        [waypointX + value, waypointY],
      ]
    case "S":
      return [
        [shipX, shipY],
        [waypointX, waypointY - value],
      ]
    case "W":
      return [
        [shipX, shipY],
        [waypointX - value, waypointY],
      ]
    case "L":
    case "R":
      return rotate(shipX, shipY, waypointX, waypointY, action, value)
    case "F": {
      const waypointDeltaX = waypointX - shipX
      const waypointDeltaY = waypointY - shipY

      const newShipX = shipX + waypointDeltaX * value
      const newShipY = shipY + waypointDeltaY * value

      return [
        [newShipX, newShipY],
        [newShipX + waypointDeltaX, newShipY + waypointDeltaY],
      ]
    }
    default:
      throw new Error(
        `Should not reach this ${[
          shipX,
          shipY,
          waypointX,
          waypointY,
          action,
          value,
        ]}`
      )
  }
}

const problem1 = flow([
  parseLines,
  (l) => l.reduce(moveHeading, [0, 0, "E"]).slice(0, 2).map(Math.abs),
  sum,
])

const problem2 = flow([
  parseLines,
  (l) =>
    l
      .reduce(moveWaypoint, [
        [0, 0],
        [10, 1],
      ])[0]
      .map(Math.abs),
  sum,
])

module.exports = [problem1, problem2]
