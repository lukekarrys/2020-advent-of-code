const parseLines = (lines) => {
  const [ts, trains] = lines
  return {
    ts: +ts,
    trains: trains
      .split(",")
      .map((t, i) => (t === "x" ? t : [+t, i]))
      .filter((x) => x !== "x"),
  }
}

const problem1 = (lines) => {
  const { ts, trains } = parseLines(lines)

  const trainDeparturesNearTs = trains.map(([t]) => Math.ceil(ts / t) * t)

  const trainMin = Math.min(...trainDeparturesNearTs)

  const trainId =
    trains[trainDeparturesNearTs.findIndex((t) => t === trainMin)][0]

  return (trainMin - ts) * trainId
}

// https://www.reddit.com/r/adventofcode/comments/kcb3bb/2020_day_13_part_2_can_anyone_tell_my_why_this/
// https://starboard.gg/robsh/advent-of-code-2020-n5gzhjY
// Another day getting stuck in a way that felt exactly like Day 10
// I came up with my own solution that was trying to do pretty much the same thing
// but I couldn't get the right number time, step to pass to subsequent passes
const findBus = (trains, time = 1, step = 1) => {
  if (trains.length === 0) {
    return time
  }

  const [train, offset] = trains.shift()

  while (true) {
    if ((time + offset) % train === 0) {
      return findBus(trains, time, step * train)
    }
    time += step
  }
}

const problem2 = (lines) => {
  return findBus(parseLines(lines).trains)
}

module.exports = [problem1, problem2]
