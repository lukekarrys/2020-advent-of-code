const assert = require("assert")
const { readLines, readDays, readOutput } = require("./util")

const suppressConsole = () => {
  const ogConsole = global.console
  global.console = { log: () => {}, error: () => {} }
  return () => (global.console = ogConsole)
}

const testDay = async (day) => {
  const lines = await readLines(day)
  const problems = require(`./${day}/index.js`)
  const output = await readOutput(day)

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
  const days = await readDays()
  const daysTests = (await Promise.all(days.map(testDay))).flat()

  return {
    ok: daysTests.every((t) => t.ok),
    messages: daysTests.reduce((acc, t) => [...acc, t.message], []),
  }
}

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
