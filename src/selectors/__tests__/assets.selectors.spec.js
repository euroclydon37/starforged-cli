const { getEnabledAbilities } = require('../assets.selectors')

const ASSET = {
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
      Enabled: true,
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
}

test('getEnabledAbilities', () => {
  expect(getEnabledAbilities(ASSET).map(({ $id }) => $id)).toEqual([
    'Starforged/Assets/Command_Vehicle/Starship/Abilities/1',
    'Starforged/Assets/Command_Vehicle/Starship/Abilities/2',
  ])
})
