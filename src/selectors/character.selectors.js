//#region imports
const {
  path,
  pipe,
  values,
  divide,
  __,
  multiply,
  sum,
  defaultTo,
} = require('ramda')
//#endregion

const getHealth = pipe(path(['character', 'meters', 'health']), defaultTo(5))
const getSpirit = pipe(path(['character', 'meters', 'spirit']), defaultTo(5))
const getSupply = pipe(path(['character', 'meters', 'supply']), defaultTo(5))
const getMomentum = pipe(
  path(['character', 'meters', 'momentum']),
  defaultTo(10),
)
const getMomentumReset = pipe(
  path(['character', 'meters', 'momentum_reset']),
  defaultTo(2),
)
const getMaxMomentum = pipe(
  path(['character', 'meters', 'max_momentum']),
  defaultTo(10),
)

const getCharacterAssets = pipe(path(['character', 'assets']), defaultTo([]))
const getCharacter = pipe(path(['character']), defaultTo({}))
const getLegacyTracks = pipe(
  path(['character', 'legacy', 'tracks']),
  defaultTo({}),
)

const getCharacterItems = pipe(path(['character', 'items']), defaultTo([]))

const getEarnedXP = pipe(
  getLegacyTracks,
  values,
  sum,
  divide(__, 4),
  Math.floor,
  multiply(__, 2),
)

const getSpentXP = pipe(path(['character', 'legacy', 'spent_xp']), defaultTo(0))

const getAvailableXP = (data) => {
  const earned = getEarnedXP(data)
  const spent = getSpentXP(data)
  return earned - spent
}

module.exports = {
  getHealth,
  getSpirit,
  getSupply,
  getMomentum,
  getMomentumReset,
  getMaxMomentum,
  getCharacter,
  getCharacterAssets,
  getLegacyTracks,
  getEarnedXP,
  getSpentXP,
  getAvailableXP,
  getCharacterItems,
}
