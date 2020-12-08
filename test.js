const fs = require("fs").promises
const path = require("path")
const assert = require("assert")

const readLines = async (day) => {
  const input = await fs.readFile(path.resolve(day, "input.txt"))
  return input.toString().split("\n")
}

const suppressConsole = () => {
  const ogConsole = global.console
  global.console = { log: () => {}, error: () => {} }
  return () => (global.console = ogConsole)
}

const testDay = async (day) => {
  const lines = await readLines(day)
  const problems = require(`./${day}/index.js`)
  const output = (await fs.readFile(`./${day}/output.txt`))
    .toString()
    .split("\n")
    .filter(Boolean)
    .map((n) => +n)

  const tests = []

  for (const [index, problem] of problems.entries()) {
    if (output[index] != null) {
      try {
        const undo = suppressConsole()
        const actual = await problem(lines)
        undo()
        assert.deepStrictEqual(
          actual,
          output[index],
          `Day ${day}, Problem ${index + 1}`
        )
        tests.push({ ok: true, message: `✅ Day ${day}, Problem ${index + 1}` })
      } catch (e) {
        tests.push({ ok: false, message: errorMessage(e) })
      }
    }
  }

  return tests
}

const errorMessage = (e) => {
  if (e.hasOwnProperty("actual")) {
    return `❌ ${e.message}\nActual: ${e.actual}\nExpected: ${e.expected}`
  } else {
    return `${e.message}\n${e.stack}`
  }
}

const main = async () => {
  const days = await fs.readdir("./")
  const daysTests = (
    await Promise.all(days.filter((d) => !isNaN(+d)).map(testDay))
  ).flat()

  return {
    ok: daysTests.every((t) => t.ok),
    messages: daysTests.reduce((acc, t) => [...acc, t.message], []),
  }
}

if (require.main !== module) {
  module.exports = testDay
} else {
  main()
    .then((res) => {
      console.log(res.messages.join("\n"))
      if (!res.ok) {
        process.exit(1)
      }
    })
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}
