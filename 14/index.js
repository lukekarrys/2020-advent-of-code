const { sum, flow } = require("../util")

const parseLines = (lines) => {
  let mask = null
  return lines.reduce((acc, line) => {
    if (line.startsWith("mask")) {
      mask = line.split(" = ")[1]
    } else {
      const [, address, value] = line
        .match(/^mem\[(\d+)\] = (\d+)$/)
        .map(Number)
      acc.push({ mask, value, address })
    }

    return acc
  }, [])
}

const useMask = (mask, value, iterator) =>
  value
    .toString(2)
    .padStart(mask.length, "0")
    .split("")
    .map((v, i) => iterator(mask[i], v))
    .join("")

// I knew I had done this before...
// https://github.com/bracketclub/bracket-possibilities/blob/4a746742895838543edfa7a15f97291585d433fe/src/binary-combinations.js
const binaryCombinations = (n) =>
  [...new Array(Math.pow(2, n))].map((__, i) =>
    [...new Array(n)].map((__, ii) => ((i >> ii) & 1 ? 1 : 0))
  )

const getMaskedAddresses = (mask, value) => {
  const result = useMask(mask, value, (m, v) => (m === "0" ? v : m))

  return binaryCombinations(result.match(/X/g).length).map((c) => {
    let count = 0
    return result.replace(/X/g, () => c[count++])
  })
}

const runV1 = (instructions) =>
  instructions.reduce((acc, { mask, value, address }) => {
    acc[address] = parseInt(
      useMask(mask, value, (m, v) => (m === "X" ? v : m)),
      2
    )
    return acc
  }, {})

const runV2 = (instructions) =>
  instructions.reduce((acc, { mask, value, address }) => {
    return getMaskedAddresses(mask, address).reduce((acc2, a) => {
      acc2[a] = value
      return acc2
    }, acc)
  }, {})

const problem1 = flow([parseLines, runV1, Object.values, sum])

const problem2 = flow([parseLines, runV2, Object.values, sum])

module.exports = [problem1, problem2]
