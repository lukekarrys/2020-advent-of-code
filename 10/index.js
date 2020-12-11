const { mult, lastItem, lastIndex, range, flow, sum, diff } = require("../util")

const MAX_JUMP = 3

const countDiffs = (adapters) =>
  adapters.reduce(
    (acc, adapter, index, list) => {
      if (index) {
        acc[adapter - list[index - 1]] += 1
      }
      return acc
    },
    {
      3: 0,
      1: 0,
    }
  )

const parseLines = (lines) => {
  return lines.map((line) => +line).sort((a, b) => a - b)
}

const problem1 = flow([
  parseLines,
  (a) => [0, ...a, lastItem(a) + MAX_JUMP],
  countDiffs,
  Object.values,
  mult,
])

// Couldn't figure this one out on my own so I ended up on reddit
// https://www.reddit.com/r/adventofcode/comments/ka8z8x/2020_day_10_solutions/gf905da
// to find the dynamic programming solution. I knew it would use DP/recursion/memo
// but couldn't work out what to do in each step to get all the paths.
// I originally looked at it as a graph problem which I think makes sense but
// I also couldn't figure out how to count the walks properly even after
// splitting up the input to all the smaller graphs.
const countAdapterPaths = (currentIndex, adapters, maxJump, cache = {}) => {
  if (currentIndex === lastIndex(adapters)) return 1

  if (cache[currentIndex]) return cache[currentIndex]

  const remainingIndices = range(currentIndex + 1, adapters.length)

  const answer = remainingIndices.reduce((acc, nextIndex) => {
    if (adapters[nextIndex] - adapters[currentIndex] <= maxJump) {
      acc += countAdapterPaths(nextIndex, adapters, maxJump, cache)
    }
    return acc
  }, 0)

  cache[currentIndex] = answer

  return answer
}

const problem2 = flow([
  parseLines,
  (a) => [0, ...a, lastItem(a) + MAX_JUMP],
  (adapters) =>
    countAdapterPaths(
      adapters[0],
      adapters,
      diff(adapters.slice(adapters.length - 2).reverse())
    ),
])

class ZeroMap extends Map {
  constructor(previousKeys) {
    super([[0, 1]])
    this.previousKeys = previousKeys
  }

  get(...args) {
    return super.get(...args) || 0
  }

  sumPrevious(key) {
    return this.set(
      key,
      sum(range(1, this.previousKeys).map((i) => this.get(key - i)))
    )
  }
}

// Also found this interesting linear time one that I never would've come up
// with on my own https://www.reddit.com/r/adventofcode/comments/ka8z8x/2020_day_10_solutions/gfbo8r3
// Edited it a bit just for fun
const problem2Linear = flow([
  parseLines,
  (lines) =>
    lines
      .reduce((map, key) => map.sumPrevious(key), new ZeroMap(MAX_JUMP))
      .get(Math.max(...lines)),
])

module.exports = [problem1, problem2Linear]
