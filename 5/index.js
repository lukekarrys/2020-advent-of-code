const { lastIndex } = require("../util")

const LOWER = "L"
const UPPER = "U"

const binarySpacePartition = (arr) => {
  return arr.reduce(
    ([min, max], item, index) => {
      if (index === lastIndex(arr)) {
        return item === LOWER ? min : max
      }
      const half = (min + max) / 2
      return item === LOWER ? [min, Math.floor(half)] : [Math.ceil(half), max]
    },
    [0, Math.pow(2, arr.length) - 1]
  )
}

const parsePasses = (lines) => {
  return lines.map((line) => {
    const row = binarySpacePartition(
      line
        .slice(0, 7)
        .split("")
        .map((c) => (c === "F" ? LOWER : UPPER))
    )
    const col = binarySpacePartition(
      line
        .slice(7)
        .split("")
        .map((c) => (c === "L" ? LOWER : UPPER))
    )
    return row * 8 + col
  })
}

const problem1 = (lines) => {
  const passes = parsePasses(lines)

  return Math.max(...passes)
}

const problem2 = (lines) => {
  const passes = parsePasses(lines)

  return (
    passes

      .sort((a, b) => a - b)
      .find((id, index, list) => {
        if (id - list[index - 1] !== 1 && index !== 0) {
          return true
        }
      }) - 1
  )
}

module.exports = [problem1, problem2]
