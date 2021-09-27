const isItemInArray = (item, array) => {
  for (let idx in array) {
    if (array[idx] === item) {
      return true
    }
  }
  return false
}

const compareArray = (array1, array2) => {
  let a1 = array1.sort()
  let a2 = array2.sort()
  // console.log('a1', a1, 'a2', a2)
  if (a1 === a2) return true
  if ((!a1 && a2) || (a1 && !a2)) return false
  if (a1.length !== a2.length) return false
  for (let i in a1) {
    if (a1[i] !== a2[i]) return false
  }
  return true
}

module.exports = {
  isItemInArray,
  compareArray
}
