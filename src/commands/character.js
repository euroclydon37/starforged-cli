//#region Requires
const prompts = require('prompts')
const { readDb, writeDb } = require('../db')
const {
  setMomentum,
  setMomentumReset,
  setMaxMomentum,
  setHealth,
  setSpirit,
  setSupply,
} = require('../setters')
const {
  selectAssetFromList,
  chooseAsset,
  selectCharacterAsset,
  getPropByPrompt,
  autocompletePromptByIndex,
} = require('../userPrompts')
const { starforged } = require('dataforged')
const {
  pipe,
  filter,
  prop,
  equals,
  last,
  compose,
  not,
  map,
  join,
  remove,
} = require('ramda')
const { getEnabledAbilities } = require('../selectors/assets.selectors')
const { marked } = require('marked')
const {
  getMomentum,
  getMomentumReset,
  getMaxMomentum,
  getHealth,
  getSpirit,
  getSupply,
  getCharacterAssets,
  getCharacter,
  getLegacyTracks,
  getEarnedXP,
  getSpentXP,
  getAvailableXP,
  getCharacterItems,
} = require('../selectors/character.selectors')
const { toTitle } = require('../utils')
//#endregion

//#region functions
//#region utilities
const makeCharacter = ({ name, edge, heart, iron, shadow, wits, assets }) => ({
  name,
  stats: {
    edge,
    heart,
    iron,
    shadow,
    wits,
  },
  meters: {
    health: 5,
    spirit: 5,
    supply: 5,
    momentum: 2,
    momentum_reset: 2,
    max_momentum: 10,
  },
  legacy: {
    tracks: {
      quests: 0,
      bonds: 0,
      discoveries: 0,
    },
    spent_xp: 0,
  },
  items: [],
  assets,
})

const nameIsNot =
  (name) =>
  ({ Name }) =>
    not(equals(name, Name))
//#endregion

async function createCharacter() {
  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'What name would you like?',
  })

  const allPaths = pipe(
    filter(pipe(prop('Name'), equals('Path'))),
    last,
    prop('Assets'),
  )(starforged['Asset Types'])

  const starship = starforged['Asset Types'][0].Assets[0]
  const firstPath = await selectAssetFromList(allPaths)
  const secondPath = await selectAssetFromList(
    allPaths.filter(nameIsNot(firstPath.Name)),
  )
  const finalAsset = await chooseAsset()

  const assets = [starship, firstPath, secondPath, finalAsset]

  const characterStats = {
    edge: undefined,
    heart: undefined,
    iron: undefined,
    shadow: undefined,
    wits: undefined,
  }

  const getUnassignedStats = () =>
    Object.keys(characterStats).filter(
      (key) => characterStats[key] === undefined,
    )

  const statValues = [3, 2, 2, 1, 1]

  while (getUnassignedStats().length > 0) {
    const value = statValues.shift()
    const { key } = await prompts({
      type: 'select',
      name: 'key',
      message: `Which stat should have be ${value}?`,
      choices: getUnassignedStats().map((statName) => ({
        title: statName,
        value: statName,
      })),
    })

    characterStats[key] = value
  }

  const data = await readDb()

  data.character = makeCharacter({ name, ...characterStats, assets })

  await writeDb(data)
  console.log(`Created character named ${name}`)
}

async function updateMomentum() {
  const data = await readDb()
  const momentum = getMomentum(data)
  const reset = getMomentumReset(data)
  const max = getMaxMomentum(data)
  const { amount } = await prompts({
    type: 'number',
    name: 'amount',
    message: `Your momentum was ${momentum}. What would you like to set it to? (Reset ${reset}, Max ${max})`,
  })

  const newAmount = Math.min(amount, max)

  await setMomentum(newAmount)

  console.log(`Your momentum is now ${newAmount}.`)
}

async function updateMomentumReset() {
  const data = await readDb()
  const reset = getMomentumReset(data)
  const { amount } = await prompts({
    type: 'number',
    name: 'amount',
    message: `Your momentum reset was ${reset}. What would you like to set it to?`,
  })
  await setMomentumReset(amount)
  console.log(`Your momentum reset is now ${amount}.`)
}

async function updateMaxMomentum() {
  const data = await readDb()
  const max = getMaxMomentum(data)
  const { amount } = await prompts({
    type: 'number',
    name: 'amount',
    message: `Your max momentum was ${max}. What would you like to set it to?`,
  })
  await setMaxMomentum(amount)
  console.log(`Your max momentum is now ${amount}.`)
}

async function updateHealth() {
  const data = await readDb()
  const health = getHealth(data)
  const { amount } = await prompts({
    type: 'number',
    name: 'amount',
    message: `Your health was ${health}. What would you like to set it to?`,
  })
  await setHealth(amount)
  console.log(`Your health is now ${amount}.`)
}

async function updateSpirit() {
  const data = await readDb()
  const spirit = getSpirit(data)
  const { amount } = await prompts({
    type: 'number',
    name: 'amount',
    message: `Your spirit was ${spirit}. What would you like to set it to?`,
  })
  await setSpirit(amount)
  console.log(`Your spirit is now ${amount}.`)
}

async function updateSupply() {
  const data = await readDb()
  const supply = getSupply(data)
  const { amount } = await prompts({
    type: 'number',
    name: 'amount',
    message: `Your supply was ${supply}. What would you like to set it to?`,
  })
  await setSupply(amount)
  console.log(`Your supply is now ${amount}.`)
}

async function viewStats() {
  const data = await readDb()
  console.log(data.character.stats)
}

async function viewMeters() {
  const data = await readDb()
  console.log(data.character.meters)
}

async function viewAbilities() {
  const asset = await selectCharacterAsset()
  console.log(
    '\n',
    pipe(
      getEnabledAbilities,
      map(pipe(prop('Text'), (text) => `- ${text}`, marked)),
      join(''),
    )(asset),
  )
}

async function updateMeter() {
  const commands = {
    momentum: updateMomentum,
    health: updateHealth,
    spirit: updateSpirit,
    supply: updateSupply,
    maxMomentum: updateMaxMomentum,
    momentumReset: updateMomentumReset,
  }

  const command = await getPropByPrompt({
    message: 'Which meter?',
    keyValueMap: commands,
  })

  await command()
}

async function addAsset() {
  const data = await readDb()
  const asset = await chooseAsset(
    getCharacterAssets(data).map(({ Name }) => Name),
  )
  getCharacter(data).assets.push(asset)
  await writeDb(data)
  console.log(`${asset.Name} was added.`)
}

async function upgradeAsset() {
  const data = await readDb()
  const asset = await selectCharacterAsset()

  const { abilityText } = await prompts({
    type: 'select',
    name: 'abilityText',
    message: 'Which ability do you want?',
    choices: asset.Abilities.filter(compose(not, prop('Enabled'))).map(
      ({ Text }) => ({ title: Text, value: Text }),
    ),
  })

  data.character.assets.forEach((a) => {
    if (a.Name === asset.Name) {
      a.Abilities.forEach((ability) => {
        if (ability.Text === abilityText) {
          ability.Enabled = true
        }
      })
    }
  })

  await writeDb(data)
  console.log('Ability learned.')
}

async function markTickOnLegacyTrack() {
  const data = await readDb()
  const legacyTracks = getLegacyTracks(data)

  const track = await getPropByPrompt({
    message: 'Which legacy track?',
    keyValueMap: legacyTracks,
    map: (key, value) => ({ name: key, value }),
  })

  const { tickCount } = await prompts({
    type: 'number',
    name: 'tickCount',
    message: 'How many ticks do you want to mark?',
  })

  track.value.ticks += tickCount
  await writeDb(data)

  console.log(
    `${tickCount} ticks have been marked on your ${toTitle(
      track.name,
    )} legacy track`,
  )
}

async function viewExperience() {
  const data = await readDb()
  console.log(`You've earned ${getEarnedXP(data)} xp.`)
  console.log(`You've spent ${getSpentXP(data)} xp.`)
  console.log(`You have ${getAvailableXP(data)} xp remaining.`)
}

async function spendExperience() {
  const data = await readDb()
  const { amount } = await prompts({
    type: 'number',
    name: 'amount',
    message: 'How much xp are you spending?',
  })

  if (amount > getAvailableXP(data)) {
    console.log(`You only have ${getAvailableXP(data)} xp.`)
    return
  }

  data.character.legacy.spent_xp += amount
  await writeDb(data)
  console.log(`You now have ${getAvailableXP(data)} xp available.`)
}

async function viewItems() {
  const data = await readDb()
  console.log(getCharacterItems(data))
}

async function addItem() {
  const { itemString } = await prompts({
    type: 'text',
    name: 'itemString',
    message: 'What item do you want to add?',
  })

  const data = await readDb()

  data.character.items.push(itemString)
  await writeDb(data)
  console.log('Item added.')
}

async function removeItem() {
  const data = await readDb()

  const index = await autocompletePromptByIndex({
    message: 'Which item would you like to remove?',
    choices: getCharacterItems(data),
  })

  data.character.items = remove(index, 1, getCharacterItems(data))
  await writeDb(data)
  console.log('Item removed.')
}
//#endregion

async function manageCharacter() {
  const commands = {
    createCharacter,
    updateMeter,
    viewStats,
    viewMeters,
    viewAbilities,
    viewItems,
    addItem,
    removeItem,
    viewExperience,
    addAsset,
    upgradeAsset,
    markTickOnLegacyTrack,
    spendExperience,
  }

  const command = await getPropByPrompt({
    message: 'Choose a command.',
    keyValueMap: commands,
  })

  await command()
}

module.exports = { manageCharacter }
