/*
Rail Fence Cypher: Encoding and Decoding coding challenge
https://en.wikipedia.org/wiki/Rail_fence_cipher
=========================================================================================
*/

/*
  First we need to generate diagonal values so it matches the rail cipher like:
  a      e
    b   d
      c
*/
const generateDiagonalValues = (string, numberRails, fakeValues = false, decode = false) => {
  const _string = typeof string === 'string' ? Array.from(string) : [].concat(...string) // we use "all" the characters for decoding
  let letters = decode ? '' : [...new Array(numberRails)] // if not decoding, we're assigning arrays
  let count = 0
  let increase = true // this is the direction of the diagonal values to determine if it's going "down" or back "up"

  if (string == '') return ''

  _string.forEach(letter => {
    const val = fakeValues ? '-' : letter // use to put dummy holders in place for decoding

    if (decode) letters += string[count].shift()
    else letters[count] ? letters[count].push(val) : letters[count] = [val] // assign each letter to the row/column

    // adjust the counter direction so we know what order each letter
    increase ? count += 1 : count -= 1
    if (count === (numberRails - 1)) increase = false
    if (count === 0) increase = true
  })

  return letters
}


// Encoding is easy... just assign the string to rows / columns, then flatten it. Would have uses .flat() but needs node 11 or greater.
const encodeRailFenceCipher = (string, numberRails) => {
  const letters = generateDiagonalValues(string, numberRails)
  return [].concat(...letters).join('')
}


/* hard part - ffs took me days solving this...
   need to read values across the diagonal instead of up and down, like:
  1      5
    2   4
      3
*/
const decodeRailFenceCipher = (string, numberRails) => {
  // we assign fake values, so that we have a grid to reference.. but we don't yet know what the values are
  const letters = generateDiagonalValues(string, numberRails, true)
  const stringArray = Array.from(string) // we'll use this to loop through each character

  let stringCount = 0 // actual string letters
  let count = 0 // column count for each "diagonal" array
  let row = 0 // row count
  let increase = true

  /*
    we now assign the characters to the unknown values we set earlier according to how the grid is, ie:
    1       2
      3   4   5
        6       7
  */
  stringArray.forEach(letter => {
    if (!letters[row]) return // once we reach the end of the rows

    const rowLength = letters[row].length // number of characters in the current row

    if (count < rowLength) letters[row][count] = stringArray[stringCount] // assigns the letters to the right positions of the dummy grid we created
    stringCount += 1

    // then up the counter for each column, and row once the row count has been maxed
    if (count < rowLength) count += 1
    if (count === rowLength && row < letters.length) {
      count = 0
      row += 1
    }
  })

  // finally, generate the code/read the diagonal values based on the values we just assigned to give us the decrypted version
  return generateDiagonalValues(letters, numberRails, false, true)
}
