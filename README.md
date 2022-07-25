# Work in Progress

My goal is for this to be an easy-to-use CLI for playing Starforged solo. If your game ends up in a broken state of some sort, and no command yet exists to fix your issue, all of the game data you accumulate is stored in `~/starforged-cli/db.json` and you can make edits there.

To use the utility, it's as simple as running the `rpg` command.
```shell
rpg
```
---
## Commands
**Dice** - _`Roll Dice` and then `Interpret Results`. I separated them to make it simple to manage dice re-rolls._<br>
**Vows** - _Manage your vows._<br>
**Moves** - _Find and print moves to the console for reference._<br>
**NPC** - _Manage NPCs and their connections._<br>
**Story** - _This is for adding journal entries of the events in your story._<br>
**Lore** - _This is a utility for tracking entities in your universe and the facts (and other entities) associated with them._<br>
**Oracle** - _Make wonderful use of all the random tables in Starforged._<br>
**Assets** - _Find and print assets to the console for reference._<br>
**Character** - _This is where most of the work is done. Create and manage your character. Update your health, etc._<br>

---
## Feature Roadmap
Feel free to request features by opening an issue. This is what I currently want to add.
1. Support creating multiple characters (in the same universe) and switching between them.
2. Support multiple universes with their own lore, characters, etc.