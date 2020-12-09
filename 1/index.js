const { twoSum, mult } = require("../util")

const NUM = 2020

const problem1 = (lines) => {
  const numbers = lines.map((n) => +n)
  return mult(twoSum(numbers, NUM))
}

const threeSum = (lines) => {
  const numbers = lines.map((n) => +n)
  let res = null

  numbers.forEach((num1, index1) => {
    numbers.forEach((num2, index2) => {
      numbers.forEach((num3, index3) => {
        if (index1 !== index2 && index1 !== index3) {
          if (num1 + num2 + num3 === NUM) {
            res = [num1, num2, num3]
            return
          }
        }
      })
      if (res) return
    })
    if (res) return
  })

  return mult(res)
}

module.exports = [problem1, threeSum]
