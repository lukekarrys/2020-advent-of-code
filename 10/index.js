const { mult, lastItem, lastIndex, range, flow } = require("../util")

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
  const adapters = lines.map((line) => +line).sort((a, b) => a - b)
  return [0, ...adapters, lastItem(adapters) + 3]
}

const problem1 = flow([parseLines, countDiffs, Object.values, mult])

// Couldn't figure this one out on my own so I ended up on reddit
// to find the dynamic programming solution. I knew it would use DP/recursion/memo
// but couldn't work out what to do in each step to get all the paths.
// I originally looked at it as a graph problem which I think makes sense but
// I also couldn't figure out how to count the walks properly even after
// splitting up the input to all the smaller graphs
// https://www.reddit.com/r/adventofcode/comments/ka8z8x/2020_day_10_solutions/gf905da
const countAdapterPaths = (currentIndex, adapters, cache) => {
  if (currentIndex === lastIndex(adapters)) return 1

  if (cache[currentIndex]) return cache[currentIndex]

  const remainingIndices = range(currentIndex + 1, adapters.length)

  const answer = remainingIndices.reduce((acc, nextIndex) => {
    if (adapters[nextIndex] - adapters[currentIndex] <= 3) {
      acc += countAdapterPaths(nextIndex, adapters, cache)
    }
    return acc
  }, 0)

  cache[currentIndex] = answer

  return answer
}

const problem2 = flow([
  parseLines,
  (adapters) => countAdapterPaths(adapters[0], adapters, {}),
])

module.exports = [problem1, problem2]
