# Work in Progress

My goal is for this to be an easy-to-use CLI for playing Starforged solo. If your game ends up in a broken state of some sort, and no command yet exists to fix your issue, all of the game data you accumulate is stored in `~/starforged-cli/db.json` and you can make edits there.

To use the utility, it's as simple as running the `rpg` command.
```shell
rpg
```

## Commands
1. **Dice** - `Roll Dice` and then `Interpret Results`. I separated them to make it simple to manage dice re-rolls.
2. **Vows** - Manage your vows.
3. **Moves** - Find and print moves to the console for reference.
4. **NPC** - Manage NPCs and their connections.
5. **Story** - This is for adding journal entries of the events in your story.
6. **Lore** - This is a utility for tracking entities in your universe and the facts (and other entities) associated with them.
7. **Oracle** - Make wonderful use of all the random tables in Starforged.
8. **Assets** - Find and print assets to the console for reference.
9. **Character** - This is where most of the work is done. Create and manage your character. Update your health, etc.
