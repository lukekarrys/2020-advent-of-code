const { lastItem } = require("../util")

const range = (val, min, max) => {
  const num = +val
  return num >= min && num <= max
}

const VALIDATION = {
  byr: (val = "") => val.length === 4 && range(val, 1920, 2002),
  iyr: (val = "") => val.length === 4 && range(val, 2010, 2020),
  eyr: (val = "") => val.length === 4 && range(val, 2020, 2030),
  hgt: (v = "") => {
    const [, val, unit] = v.match(/^(\d+)(in|cm)$/) || []
    return unit === "cm"
      ? range(val, 150, 193)
      : unit === "in"
      ? range(val, 59, 76)
      : false
  },
  hcl: (v = "") => /^#[a-f0-9]{6}$/.test(v),
  ecl: (v = "") => "amb blu brn gry grn hzl oth".split(" ").includes(v),
  pid: (v = "") => /^[0-9]{9}$/.test(v),
}

const VALIDATORS = Object.entries(VALIDATION)

const REQUIRED_FIELDS = VALIDATORS.map(([k]) => k)

const parsePassports = (lines) => {
  return lines.reduce(
    (acc, line) => {
      if (!line) {
        acc.push({})
        return acc
      }

      const fields = line.split(" ").map((field) => field.split(":"))

      fields.forEach(([key, value]) => {
        lastItem(acc)[key] = value
      })

      return acc
    },
    [{}]
  )
}

const problem1 = (lines) => {
  const passports = parsePassports(lines)

  return passports.filter((p) => {
    return REQUIRED_FIELDS.every((f) => p.hasOwnProperty(f))
  }).length
}

const problem2 = (lines) => {
  const passports = parsePassports(lines)

  return passports.filter((p) => {
    return VALIDATORS.every(([field, validator]) => {
      return validator(p[field])
    })
  }).length
}

module.exports = [problem1, problem2]
