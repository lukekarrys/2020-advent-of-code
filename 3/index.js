const colors = require("colors/safe")
const { lastIndex, mult } = require("../util")

const HIT = "X"
const MISS = "O"
const DEBUG = false
const debug = (...parts) => DEBUG && console.log(...parts)

const wrap = (arr, nextIndex) => {
  const needsWrap = nextIndex > lastIndex(arr)
  return nextIndex - (needsWrap ? arr.length : 0)
}

const walkSlope = (lines, x, y) => {
  let xPosition = 0

  const hits = lines.filter((line, lineIndex) => {
    const useLine = lineIndex % y === 0
    const isHit = line[xPosition] === HIT
    const result = useLine && isHit

    const vizLine = line
      .map((c, i) =>
        xPosition === i && useLine ? colors[isHit ? "red" : "green"](c) : c
      )
      .join("")

    debug(vizLine, result)

    xPosition = wrap(line, xPosition + x)

    return result
  }).length

  debug(`${hits}/${lines.length}`, x, y)
  debug("=".repeat(80))

  return hits
}

const problem1 = (lines) => {
  const mountain = lines.map((n) => {
    return n.split("").map((c) => (c === "#" ? HIT : MISS))
  })

  return walkSlope(mountain, 3, 1)
}

const problem2 = (lines) => {
  const mountain = lines.map((n) => {
    return n.split("").map((c) => (c === "#" ? HIT : MISS))
  })

  return mult(
    [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ].map((slope) => walkSlope(mountain, ...slope))
  )
}

module.exports = [problem1, problem2]
