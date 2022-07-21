const { path } = require("ramda");

const getHealth = path(["character", "meters", "health"]);
const getSpirit = path(["character", "meters", "spirit"]);
const getSupply = path(["character", "meters", "supply"]);
const getMomentum = path(["character", "meters", "momentum"]);
const getMomentumReset = path(["character", "meters", "momentum_reset"]);
const getMaxMomentum = path(["character", "meters", "max_momentum"]);

const getCharacterAssets = path(["character", "assets"]);
const getCharacter = path(["character"]);

module.exports = {
  getHealth,
  getSpirit,
  getSupply,
  getMomentum,
  getMomentumReset,
  getMaxMomentum,
  getCharacter,
  getCharacterAssets,
};
