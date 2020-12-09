const { twoSum, sum, lastItem } = require("../util")

const parseLines = (lines) => {
  return lines.map((line) => +line)
}

const problem1 = (lines) => {
  const numbers = parseLines(lines)
  for (let i = 25; i < numbers.length; i++) {
    if (twoSum(numbers.slice(i - 25, i), numbers[i]) === null) {
      return numbers[i]
    }
  }
}

const problem2 = (lines) => {
  const answer1 = problem1(lines)
  const numbers = parseLines(lines)

  let contiguousWindow = 2

  while (contiguousWindow <= numbers.length) {
    for (let i = 0; i < numbers.length; i += 1) {
      const contiguousNumbers = numbers.slice(i, i + contiguousWindow)
      if (sum(contiguousNumbers) === answer1) {
        return Math.min(...contiguousNumbers) + Math.max(...contiguousNumbers)
      }
    }

    contiguousWindow += 1
  }
}

module.exports = [problem1, problem2]
