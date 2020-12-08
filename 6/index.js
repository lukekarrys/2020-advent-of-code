const uniqYesesPerGroup = (group) => {
  return group.reduce((acc, person) => new Set([...acc, ...person]), new Set())
}

const allYesesPerGroup = (group) => {
  const yesPerQuestion = {}

  group.forEach((person) => {
    person.forEach((question) => {
      yesPerQuestion[question] = (yesPerQuestion[question] ?? 0) + 1
    })
  })

  return [...Object.values(yesPerQuestion)].filter(
    (count) => count === group.length
  )
}

const parseGroups = (lines) => {
  return lines.reduce(
    (acc, line) => {
      if (!line) {
        acc.push([])
        return acc
      }
      acc[acc.length - 1].push(line.split(""))
      return acc
    },
    [[]]
  )
}

const problem1 = (lines) => {
  const groups = parseGroups(lines)

  return groups.reduce((acc, group) => {
    return acc + uniqYesesPerGroup(group).size
  }, 0)
}

const problem2 = (lines) => {
  const groups = parseGroups(lines)

  return groups.reduce((acc, group) => {
    return acc + allYesesPerGroup(group).length
  }, 0)
}

module.exports = [problem1, problem2]
