const countChars = (str) =>
  str.split("").reduce((acc, l) => {
    acc[l] = (acc[l] ?? 0) + 1
    return acc
  }, {})

const parsePasswords = (lines) =>
  lines.map((n) => {
    return n.match(/^(\d+)-(\d+) (\w): (\w+)$/).slice(1)
  })

const problem1 = (lines) => {
  const passwords = parsePasswords(lines)

  return passwords.filter(([min, max, letter, password]) => {
    const passwordChars = countChars(password)
    return passwordChars[letter] >= min && passwordChars[letter] <= max
  }).length
}

const problem2 = (lines) => {
  const passwords = parsePasswords(lines)

  return passwords.filter(([index1, index2, letter, password]) => {
    const index1HasLetter = password[index1 - 1] === letter
    const index2HasLetter = password[index2 - 1] === letter
    return [index1HasLetter, index2HasLetter].filter(Boolean).length === 1
  }).length
}

module.exports = [problem1, problem2]
