const mult = (arr) => arr.reduce((a, b) => a * b, 1)

const twoSum = (lines) => {
  const numbers = lines.map((n) => +n)

  let res = null

  numbers.forEach((num1, index1) => {
    numbers.forEach((num2, index2) => {
      if (index1 !== index2) {
        if (num1 + num2 === 2020) {
          res = [num1, num2]
          return
        }
      }
    })
    if (res) return
  })

  return mult(res)
}

const threeSum = (lines) => {
  const numbers = lines.map((n) => +n)
  let res = null

  numbers.forEach((num1, index1) => {
    numbers.forEach((num2, index2) => {
      numbers.forEach((num3, index3) => {
        if (index1 !== index2 && index1 !== index3) {
          if (num1 + num2 + num3 === 2020) {
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

module.exports = [twoSum, threeSum]
