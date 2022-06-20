/*
Poker hand ranking - class to compare poker hands and output the winning hand.
Done as a bit of fun a few years ago for CodeWars.
====================================================================
*/

const Result = { "win": 1, "loss": 2, "tie": 3 }

class PokerHand {
  constructor (hand) {
    this.hand = hand
    this.cards = { '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, 'T': 9, 'J': 10, 'Q': 11, 'K': 12, 'A': 13 }
    this.winningHands = {
      "HighCard": 10,
      "Pair": 20,
      "TwoPair": 30,
      "ThreeOfKind": 40,
      "Straight": 50,
      "Flush": 60,
      "FullHouse": 70,
      "FourOfKind": 80,
      "StraightFlush": 90,
      // "RoyalFlush": 100, we'll utilise straight flush for the scoring and high-card as the difference
    }

    this.matches = {}
    this.flushCount = 1
    this.straightCount = 1
    this.highestCard = 0
  }

  sortCards (ascending = true) {
    return this.hand
      .split(' ')
      .sort((a, b) => {
        const [cardA, suitA] = a
        const [cardB, suitB] = b

        return ascending ? this.cards[cardA] - this.cards[cardB] : this.cards[cardB] - this.cards[cardA]
      })
  }

  handResults(handToSort = this.hand) {
    return this.sortCards()
      .reduce((acc, playerCard) => {
        const [card, suit] = playerCard.split('')

        if (acc.suits.includes(suit)) this.flushCount += 1 // checks to see if suits end up 5

        if (acc.cards.includes(this.cards[card])) {
          // pairs will get added to the array to compare later
          this.matches[card] ?this. matches[card] += 1 : this.matches = { ...this.matches, [card]: 2 }
        }

        if (acc.lastCard) {
          // if accumilative, we'll store the count and last card to determine the straight
          if (acc.lastCard + 1 === this.cards[card]) this.straightCount += 1

          // we'll also update the highest card
          if (this.cards[card] > acc.lastCard) this.highestCard = this.cards[card]
        } else {
          acc.lastCard = this.cards[card]
        }

        acc.cards.push(this.cards[card])
        acc.suits.push(suit)
        acc.lastCard = this.cards[card]

        return acc
      }, { cards: [], suits: [], lastCard: null })
  }

  returnHandScore (_hand, highCard = this.highestCard) {
    const _result = { handScore: this.winningHands[_hand], highCard }

    // reset everything for the next prototype
    this.matches = {}
    this.flushCount = 1
    this.straightCount = 1
    this.highestCard = 0

    return _result
  }

  rankHand () {
    this.handResults()

    const hasFlush = this.flushCount === 5
    const hasStraight = this.straightCount === 5

    if (hasFlush && hasStraight) return this.returnHandScore('StraightFlush')
    if (hasFlush) return this.returnHandScore('Flush')
    if (hasStraight) return this.returnHandScore('Straight')

    const matchedCards = Object.entries(this.matches)
    const matchedCount = matchedCards.length

    if (matchedCount > 0) {
      if (matchedCount === 1) {
        const [card, count] = matchedCards[0]
        if (count === 4) return this.returnHandScore('FourOfKind', this.cards[card])
        if (count === 3) return this.returnHandScore('ThreeOfKind', this.cards[card])
      }

      if (matchedCount > 1) {
        if (matchedCards.some(([card, count]) => count === 3)) {
          const highestThree = matchedCards.filter(([card, count]) => count === 3)[0]
          return this.returnHandScore('FullHouse', this.cards[highestThree[0]])
        }
        else return this.returnHandScore('TwoPair')
      }

      return this.returnHandScore('Pair', this.cards[matchedCards[0][0]])
    }

    return this.returnHandScore('HighCard')
  }
}

PokerHand.prototype.compareWith = function(hand){
  const { handScore: scoreA, highCard: highCardA } = this.rankHand()
  const { handScore: scoreB, highCard: highCardB } = hand.rankHand()

  if (scoreA > scoreB) return Result.win
  if (scoreA < scoreB) return Result.loss
  if (scoreA === scoreB) {

    // certain hands will use kickers to determine the winner
    if (scoreA < 90) {

      const sortedHandA = this.sortCards(false)
      const sortedHandB = hand.sortCards(false)

      for (let i = 0; 5 > i; i++) {
        const a = sortedHandA[i].split('')[0]
        const b = sortedHandB[i].split('')[0]
        if (this.cards[a] < this.cards[b]) return Result.loss
        if (this.cards[a] > this.cards[b]) return Result.win
      }

      return Result.tie
    }

    if (highCardA > highCardB) return Result.win
    if (highCardA < highCardB) return Result.loss

    return Result.tie
  }
}
