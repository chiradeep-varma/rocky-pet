# Rocky — Desktop Pet for VS Code

> *"Fist my bump."*

Rocky from *Project Hail Mary* lives in your VS Code panel. He climbs the floor, walls, and ceiling of his little window, takes naps, gets excited, and shouts the occasional Rocky-ism while you code.

## Features

- **Free-roam climbing** — Rocky walks the entire perimeter of his panel: floor, walls, ceiling. Same animation, rotated to match the surface.
- **Autonomous moods** — strolls, sprints, idles, gets excited, and naps on his own.
- **40+ Rocky-style dialogues** — including Project Hail Mary classics and code-themed lines that use your system username (so Rocky calls you by name).
- **Sparkle and Zzz particles** — for celebratory and sleepy moments.
- **Adaptive sizing** — Rocky scales to fit whatever panel height you give him.
- **Lightweight** — pure canvas + a single spritesheet, no runtime dependencies.

## Installing

1. Grab the latest `rocky-pet-X.Y.Z.vsix` from the [Releases page](https://github.com/chiradeep-varma/rocky-pet/releases).
2. In VS Code: **Extensions** → `…` (top-right of the sidebar) → **Install from VSIX…** → pick the file.
3. Reload. Rocky appears in the bottom panel automatically.

If he isn't visible, run **Rocky: Show Pet** from the command palette (`Cmd/Ctrl+Shift+P`).

## Commands

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `Rocky: Show Pet`  | Reveal Rocky in the bottom panel. |
| `Rocky: Hide Pet`  | Dispose the Rocky view.           |

## Building from source

```bash
git clone https://github.com/chiradeep-varma/rocky-pet.git
cd rocky-pet
npm install
npm run compile
```

Then press `F5` in VS Code to launch an extension development host.

## Packaging a `.vsix`

```bash
npm run package               # produces rocky-pet-<version>.vsix
```

Then drag the `.vsix` onto a GitHub Release.

## Credits

- Character: Rocky, from *Project Hail Mary* by Andy Weir.
- This is a fan project; not affiliated with the author or rights holders.

## License

MIT — see [LICENSE](LICENSE).
