const { filter, prop } = require("ramda");

const getEnabledAbilities = filter(prop("Enabled"));

module.exports = { getEnabledAbilities };
