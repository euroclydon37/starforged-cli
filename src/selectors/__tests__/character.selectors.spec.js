const { clone } = require('ramda')

const {
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
} = require('../character.selectors')

const DATA = {
  character: {
    stats: {
      edge: 5,
      heart: 4,
      iron: 3,
      shadow: 2,
      wits: 1,
    },
    meters: {
      health: 3,
      spirit: 2,
      supply: 4,
      momentum: 5,
      momentum_reset: 4,
      max_momentum: 11,
    },
    items: ['gun', 'sash'],
    legacy: {
      tracks: {
        quests: 0,
        bonds: 4,
        discoveries: 8,
      },
      spent_xp: 5,
    },
    assets: {
      Source: {
        Title: 'Ironsworn: Starforged Assets',
        Authors: ['Shawn Tomkin'],
        Date: '050622',
      },
      'Asset Type': 'Starforged/Assets/Command_Vehicle',
      $id: 'Starforged/Assets/Command_Vehicle/Starship',
      Name: 'Starship',
      Display: {
        Title: 'Starship',
        Color: '#9aa3ad',
      },
      Usage: {
        Shared: true,
      },
      Attachments: {
        'Asset Types': ['Starforged/Assets/Module'],
        Max: null,
      },
      Inputs: [
        {
          'Input Type': 'Text',
          $id: 'Starforged/Assets/Command_Vehicle/Starship/Inputs/Name',
          Name: 'Name',
          Adjustable: false,
        },
      ],
      'Condition Meter': {
        Min: 0,
        Value: 5,
        $id: 'Starforged/Assets/Command_Vehicle/Starship/Condition_Meter',
        Name: 'Integrity',
        Max: 5,
        Conditions: ['Battered', 'Cursed'],
        Aliases: ['Command Vehicle Integrity', 'Vehicle Integrity'],
      },
      Abilities: [
        {
          $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/1',
          Text: 'Your armed, multipurpose starship is suited for interstellar and atmospheric flight. It can comfortably transport several people, has space for cargo, and can carry and launch support vehicles. When you [Advance](Starforged/Moves/Legacy/Advance), you may spend experience to equip this vehicle with module assets.',
          Enabled: true,
          'Alter Moves': [
            {
              $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/1/Alter_Moves/1',
              Moves: ['Starforged/Moves/Legacy/Advance'],
              Trigger: {
                $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/1/Alter_Moves/1/Trigger',
                By: {
                  Player: true,
                  Ally: true,
                },
              },
              Text: 'When you [Advance](Starforged/Moves/Legacy/Advance), you may spend experience to equip this vehicle with module assets.',
            },
          ],
        },
        {
          $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/2',
          Text: 'When you [Finish an Expedition](Starforged/Moves/Exploration/Finish_an_Expedition) (dangerous or greater) in your starship and score a hit, this journey strengthened your ties to your ship and any fellow travelers. You and your allies may mark 1 tick on your bonds legacy track.',
          Enabled: false,
          'Alter Moves': [
            {
              $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/2/Alter_Moves/1',
              Moves: ['Starforged/Moves/Exploration/Finish_an_Expedition'],
              Trigger: {
                $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/2/Alter_Moves/1/Trigger',
                By: {
                  Player: true,
                  Ally: true,
                },
                Options: [
                  {
                    $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/2/Alter_Moves/1/Trigger/Options/1',
                    Text: 'In your starship (dangerous or greater)',
                    'Roll type': 'Progress roll',
                    Method: 'Inherit',
                    Using: [],
                  },
                ],
              },
              Outcomes: {
                $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/2/Alter_Moves/1/Outcomes',
                'Strong Hit': {
                  Text: 'This journey strengthened your ties to your ship and any fellow travelers. You and your allies may mark 1 tick on your bonds legacy track.',
                  $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/2/Alter_Moves/1/Outcomes/Weak_Hit',
                },
                'Weak Hit': {
                  Text: 'This journey strengthened your ties to your ship and any fellow travelers. You and your allies may mark 1 tick on your bonds legacy track.',
                  $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/2/Alter_Moves/1/Outcomes/Weak_Hit',
                },
              },
            },
          ],
        },
        {
          $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/3',
          Text: 'When you [Withstand Damage](Starforged/Moves/Suffer/Withstand_Damage), you may roll +heart. If you do, [Endure Stress](Starforged/Moves/Suffer/Endure_Stress) (-1) on a weak hit or miss.',
          Enabled: false,
          'Alter Moves': [
            {
              $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/3/Alter_Moves/1',
              Moves: ['Starforged/Moves/Suffer/Withstand_Damage'],
              Trigger: {
                $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/3/Alter_Moves/1/Trigger',
                By: {
                  Player: true,
                  Ally: true,
                },
                Options: [
                  {
                    $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/3/Alter_Moves/1/Trigger/Options/1',
                    Text: 'To your Starship',
                    'Roll type': 'Action roll',
                    Method: 'Any',
                    Using: ['Heart'],
                  },
                ],
              },
              Outcomes: {
                $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/3/Alter_Moves/1/Outcomes',
                'Weak Hit': {
                  Text: '[Endure Stress](Starforged/Moves/Suffer/Endure_Stress) (-1).',
                  $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/3/Alter_Moves/1/Outcomes/Miss',
                },
                Miss: {
                  Text: '[Endure Stress](Starforged/Moves/Suffer/Endure_Stress) (-1).',
                  $id: 'Starforged/Assets/Command_Vehicle/Starship/Abilities/3/Alter_Moves/1/Outcomes/Miss',
                },
              },
            },
          ],
        },
      ],
    },
  },
}

const UNCHANGED_DATA = clone(DATA)

describe('getHealth', () => {
  test('empty', () => {
    expect(getHealth(undefined)).toEqual(5)
    expect(getHealth(null)).toEqual(5)
    expect(getHealth({})).toEqual(5)
  })

  test('real data', () => {
    expect(getHealth(DATA)).toEqual(3)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getSpirit', () => {
  test('empty', () => {
    expect(getSpirit(undefined)).toEqual(5)
    expect(getSpirit(null)).toEqual(5)
    expect(getSpirit({})).toEqual(5)
  })

  test('real data', () => {
    expect(getSpirit(DATA)).toEqual(2)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getSupply', () => {
  test('empty', () => {
    expect(getSupply(undefined)).toEqual(5)
    expect(getSupply(null)).toEqual(5)
    expect(getSupply({})).toEqual(5)
  })

  test('real data', () => {
    expect(getSupply(DATA)).toEqual(4)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getMomentum', () => {
  test('empty', () => {
    expect(getMomentum(undefined)).toEqual(10)
    expect(getMomentum(null)).toEqual(10)
    expect(getMomentum({})).toEqual(10)
  })

  test('real data', () => {
    expect(getMomentum(DATA)).toEqual(5)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getMomentumReset', () => {
  test('empty', () => {
    expect(getMomentumReset(undefined)).toEqual(2)
    expect(getMomentumReset(null)).toEqual(2)
    expect(getMomentumReset({})).toEqual(2)
  })

  test('real data', () => {
    expect(getMomentumReset(DATA)).toEqual(4)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getMaxMomentum', () => {
  test('empty', () => {
    expect(getMaxMomentum(undefined)).toEqual(10)
    expect(getMaxMomentum(null)).toEqual(10)
    expect(getMaxMomentum({})).toEqual(10)
  })

  test('real data', () => {
    expect(getMaxMomentum(DATA)).toEqual(11)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getCharacter', () => {
  test('empty', () => {
    expect(getCharacter(undefined)).toEqual({})
    expect(getCharacter(null)).toEqual({})
    expect(getCharacter({})).toEqual({})
  })

  test('real data', () => {
    expect(getCharacter(DATA)).toEqual(DATA.character)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getCharacterAssets', () => {
  test('empty', () => {
    expect(getCharacterAssets(undefined)).toEqual([])
    expect(getCharacterAssets(null)).toEqual([])
    expect(getCharacterAssets({})).toEqual([])
  })

  test('real data', () => {
    expect(getCharacterAssets(DATA)).toEqual(DATA.character.assets)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getLegacyTracks', () => {
  test('empty', () => {
    expect(getLegacyTracks(undefined)).toEqual({})
    expect(getLegacyTracks(null)).toEqual({})
    expect(getLegacyTracks({})).toEqual({})
  })

  test('real data', () => {
    expect(getLegacyTracks(DATA)).toEqual({
      quests: 0,
      bonds: 4,
      discoveries: 8,
    })
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getEarnedXP', () => {
  test('empty', () => {
    expect(getEarnedXP(undefined)).toEqual(0)
    expect(getEarnedXP(null)).toEqual(0)
    expect(getEarnedXP({})).toEqual(0)
  })

  test('real data', () => {
    expect(getEarnedXP(DATA)).toEqual(6)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getSpentXP', () => {
  test('empty', () => {
    expect(getSpentXP(undefined)).toEqual(0)
    expect(getSpentXP(null)).toEqual(0)
    expect(getSpentXP({})).toEqual(0)
  })

  test('real data', () => {
    expect(getSpentXP(DATA)).toEqual(5)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getAvailableXP', () => {
  test('empty', () => {
    expect(getAvailableXP(undefined)).toEqual(0)
    expect(getAvailableXP(null)).toEqual(0)
    expect(getAvailableXP({})).toEqual(0)
  })

  test('real data', () => {
    expect(getAvailableXP(DATA)).toEqual(1)
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})

describe('getCharacterItems', () => {
  test('empty', () => {
    expect(getCharacterItems(undefined)).toEqual([])
    expect(getCharacterItems(null)).toEqual([])
    expect(getCharacterItems({})).toEqual([])
  })

  test('real data', () => {
    expect(getCharacterItems(DATA)).toEqual(['gun', 'sash'])
  })

  test('immutable', () => {
    expect(DATA).toEqual(UNCHANGED_DATA)
  })
})
