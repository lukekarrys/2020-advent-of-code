const { readLines, readDays, hrtime, readOutput } = require("./util")

let DAYS = process.argv.slice(2)

const title = (str) => {
  const remaining = 45 - str.length
  const left = Math.ceil(remaining / 2)
  const right = Math.floor(remaining / 2)
  return `${"=".repeat(left)} ${str} ${"=".repeat(right)} `
}

const main = async () => {
  const allDays = await readDays()

  if (DAYS[0] === "all" || !DAYS.length) {
    DAYS = allDays
  } else if (DAYS[0] === "latest") {
    DAYS = allDays.slice(-1)
  }

  let total = 0

  for (const day of DAYS) {
    console.log(title(`Day ${day}`))
    const lines = await readLines(day)
    const problems = require(`./${day}/index.js`)
    const output = await readOutput(day)

    for (const [index, problem] of problems.entries()) {
      const endTime = hrtime()
      const res = await problem(lines)
      const timeRes = endTime()

      const test = output[index]

      total += timeRes.nano

      console.log(
        `Problem ${index + 1}:`,
        res,
        test ? (test === res ? "✅" : "❌") : "",
        `${timeRes.ms.toFixed(3)}ms`
      )
    }
    console.log("")
  }

  return DAYS.length > 1 ? total : 0
}

main()
  .then((t) => {
    if (t) {
      console.log(title("Total"))
      console.log(`${(t / 1000 / 1000).toFixed(3)}ms`)
    }
  })
  .catch(console.error)
