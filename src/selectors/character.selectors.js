const {
  path,
  pipe,
  values,
  prop,
  reduce,
  add,
  map,
  divide,
  __,
} = require("ramda");

const getHealth = path(["character", "meters", "health"]);
const getSpirit = path(["character", "meters", "spirit"]);
const getSupply = path(["character", "meters", "supply"]);
const getMomentum = path(["character", "meters", "momentum"]);
const getMomentumReset = path(["character", "meters", "momentum_reset"]);
const getMaxMomentum = path(["character", "meters", "max_momentum"]);

const getCharacterAssets = path(["character", "assets"]);
const getCharacter = path(["character"]);
const getLegacyTracks = path(["character", "legacy", "tracks"]);

const getCharacterItems = path(["character", "items"]);

const getEarnedXP = pipe(
  getLegacyTracks,
  values,
  map(prop("ticks")),
  reduce(add, 0),
  divide(__, 4),
  Math.floor
);

const getSpentXP = path(["character", "legacy", "spent_xp"]);

const getAvailableXP = (data) => {
  const earned = getEarnedXP(data);
  const spent = getSpentXP(data);
  return earned - spent;
};

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
};
