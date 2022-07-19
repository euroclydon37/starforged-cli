const { path } = require("ramda");

const getMomentum = path(["character", "meters", "momentum"]);
const getMomentumReset = path(["character", "meters", "momentum_reset"]);
const getMaxMomentum = path(["character", "meters", "max_momentum"]);

module.exports = {
  getMomentum,
  getMomentumReset,
  getMaxMomentum,
};
