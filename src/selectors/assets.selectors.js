const { filter, prop, pipe } = require('ramda')

const getEnabledAbilities = pipe(prop('Abilities'), filter(prop('Enabled')))

module.exports = { getEnabledAbilities }
