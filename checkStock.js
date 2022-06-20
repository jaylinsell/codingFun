/*
Functions to check product availability based on attributes
====================================================================
*/
function checkTshirtOrders (n, orders) {
  const colours = ['White', 'Orange', 'Blue', 'Purple', 'Red', 'Black']
  const availableColours = colours.reduce((acc, colour) => ({ ...acc, [colour]: n / 6}), {})

  const checkOrderStock = ([order, ...restOrders], stock) => {
    if (!order) return true // if no more orders, the order passes

    // we check if either colours stock is 0 in the order array
    return order.some(color => {
      if (stock[color] === 0) return false // if any are 0, we reject the fulfillment

      const remainingStock = Object.assign({}, stock)
      remainingStock[color] -= 1 // assign the new stock level
      return checkOrderStock(restOrders, remainingStock) // re-run on the order until all arrays/orders have been checked
    })
  }

  return checkOrderStock(orders, availableColours)
}
