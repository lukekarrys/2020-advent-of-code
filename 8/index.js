const { lastIndex, lastItem } = require("../util")

const ACC = "acc"
const JMP = "jmp"
const NOP = "nop"

const parseInstructions = (lines) => {
  return lines.map((line) => {
    const [, op, sign, num] = line.match(/^(acc|jmp|nop) (\+|-)(\d+)$/)
    return {
      op,
      num: (sign === "-" ? -1 : 1) * num,
    }
  })
}

const runProgram = (programArr) => {
  const program = [...programArr.entries()]
  const visited = []

  let acc = 0
  let current = 0

  while (!visited.includes(current) && current <= lastIndex(program)) {
    const [index, instruction] = program[current]
    visited.push(index)

    current += instruction.op === JMP ? instruction.num : 1

    if (instruction.op === ACC) {
      acc += instruction.num
    }
  }

  const last = program[lastItem(visited)]

  return [
    acc,
    {
      index: last[0],
      ...last[1],
    },
  ]
}

const problem1 = (lines) => {
  const [acc, { op, num }] = runProgram(parseInstructions(lines))
  return acc - (op === ACC ? num : 0)
}

const problem2 = (lines) => {
  const program = parseInstructions(lines)

  const switchInstruction = (instruction, index, op) =>
    program.map((oInstruction, oIndex) =>
      oIndex === index ? { ...oInstruction, op } : oInstruction
    )

  for (let index = 0; index < program.length; index++) {
    const instruction = program[index]
    if (instruction.op === NOP || instruction.op === JMP) {
      const newOp = instruction.op === NOP ? JMP : NOP
      const [acc, last] = runProgram(
        switchInstruction(instruction, index, newOp)
      )
      if (last.index === lastIndex(program)) {
        return acc
      }
    }
  }
}

module.exports = [problem1, problem2]
