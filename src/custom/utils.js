import { HEROES, COMICS } from './data'

// the Knuth shuffle algorithm
export function shuffle(array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

// method to handle points calculation based on sort order as well as grouping
function calculateScore(groupedHeroes, comics) {
  const correctOrder = HEROES.filter((hero) => hero.comics === comics).sort(
    (a, b) =>
      a.rank < b.rank ? -1 : 1

  )


  return groupedHeroes ? groupedHeroes.reduce((score, { name, rank }, index) => {
    const maxPoint = getMaxPoints()
    const heroIndex = correctOrder.findIndex((hero) => hero.rank === rank && hero.name === name)
    const penalty = heroIndex >= 0 ? Math.abs(index - heroIndex) : maxPoint
    return score + (maxPoint - penalty)
  }, 0) : null
}

export function getMaxPoints() {
  return HEROES.length
}

export function getTimeBonus(timeLeft) {

  return Math.round(getSeconds(timeLeft) / 10, 0)
}



export function getGroupings(groups) {
  const maxPoint = getMaxPoints()

  const gameScore = Object.values(COMICS).reduce(
    (sum, comicsName) => sum + getNumberOfGrouping(groups[comicsName], comicsName),
    0
  )
  return `Tú fekst ${gameScore} bólkingar rættar út av ${maxPoint}`
}


export function getNumberOfGrouping(groupedHeroes, comics) {
  const correctOrder = HEROES.filter((hero) => hero.comics === comics).sort(
    (a, b) =>
      a.rank < b.rank ? -1 : 1

  )
  return groupedHeroes.reduce((score, { name }, index) => {

    const heroIndex = correctOrder.findIndex((hero) => hero.name === name)
    score += heroIndex >= 0 ? + 1 : 0
    return score
  }, 0)
}


export function getTotalScore(groups, timeLeft) {
  console.log(groups)
  const gameScore = getScore(groups)
  const timeBonus = getTimeBonus(timeLeft)
  return gameScore ? gameScore + timeBonus : 0
}


export function getScore(groups) {
  const gameScore = Object.values(COMICS).reduce(
    (sum, comicsName) => sum + calculateScore(groups[comicsName], comicsName),
    0
  )

  return gameScore
}

// method to handle to the heroe cards movement
export const move = (state, source, destination) => {
  const srcListClone = [...state[source.droppableId]]
  const destListClone =
    source.droppableId === destination.droppableId
      ? srcListClone
      : [...state[destination.droppableId]]

  const [movedElement] = srcListClone.splice(source.index, 1)
  destListClone.splice(destination.index, 0, movedElement)

  return {
    [source.droppableId]: srcListClone,
    ...(source.droppableId === destination.droppableId
      ? {}
      : {
          [destination.droppableId]: destListClone,
        }),
  }
}

// method to get time left
export const getTimeLeft = (deadline) => deadline - Date.now()

// method to get time left in seconds
export const getSeconds = (timeLeft) => Math.floor(timeLeft / 1000)

// enums for representing the game state
export const GAME_STATE = {
  READY: 'ready',
  PLAYING: 'playing',
  DONE: 'done',
  REVIEW: 'review'
}
