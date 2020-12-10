const fs = require("fs").promises
const path = require("path")

module.exports.sum = (arr) => arr.reduce((a, b) => a + b, 0)

module.exports.mult = (arr) => arr.reduce((a, b) => a * b, 1)

const lastIndex = (arr) => arr.length - 1
module.exports.lastIndex = lastIndex
module.exports.lastItem = (arr) => arr[lastIndex(arr)]

module.exports.twoSum = (numbers, sum) => {
  let res = null

  numbers.forEach((num1, index1) => {
    numbers.forEach((num2, index2) => {
      if (index1 !== index2) {
        if (num1 + num2 === sum) {
          res = [num1, num2]
          return
        }
      }
    })
    if (res) return
  })

  return res
}

module.exports.range = (start, end) =>
  [...new Array(end - start + 1)].map((el, ind) => ind + start)

module.exports.flow = (fns) => (input) =>
  fns.reduce((acc, fn) => fn(acc), input)

module.exports.readLines = async (dir) => {
  const input = await fs.readFile(path.resolve(dir, "input.txt"))
  return input.toString().split("\n")
}

module.exports.readDays = async () => {
  const dir = await fs.readdir("./")
  return dir.filter((d) => /^\d+$/.test(d)).sort((a, b) => a - b)
}
