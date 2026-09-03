# DoLP v0.768 · Aoki+Mysterious · ModLoader

A web-playable build of **Degrees of Lewdity Plus v0.768** with the existing **SugarCube 2 ModLoader** core and the **Aoki+Mysterious (MYS)** image set.

## Build design

The repository does not commit the 67 MB generated game HTML or tens of thousands of image files directly.

The build workflow instead:

1. Downloads the existing gzip-compressed v0.768 ModLoader game bundle.
2. Decompresses it and verifies the exact source before publishing.
3. Downloads the Aoki+Mysterious `img.json` mapping from DOLMods.
4. Publishes the compressed game bundle, image map, launcher and Service Worker to `gh-pages`.
5. The Service Worker decompresses the game page in-browser and maps `img/...` requests to the Aoki+Mysterious CDN files.

## Verified core

- Game marker: `0.5.11.9 DoLP v0.768`
- Uncompressed size: `67,147,773` bytes
- SHA-256: `ebda02401b169579b30bfd3796e685e60bee23d46ee06f61548c5e7f0f2108ef`
- ModLoader payload marker: `window.modDataValueZipList`

## Aoki+Mysterious image routing

The build uses the same public image mapping mechanism as the DOLMods Aoki+Mysterious web build: `img.json` maps game-relative `img/...` paths to `img.dolmods.net` asset IDs.

## Published branch

Generated site output is written to the `gh-pages` branch. The branch contains:

- `index.html`
- `game-v0768.html`
- `sw.js`
- `img.json`
- `pako_inflate.min.js`
- `payload/game-v0768.bundle`
- `build-info.json`

## GitHub Pages

Configure repository **Settings → Pages** to deploy from the `gh-pages` branch at `/ (root)`.
