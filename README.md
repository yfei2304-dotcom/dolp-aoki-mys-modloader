# DoLP v0.772 · Aoki+Mysterious · ModLoader

A web-playable build of **Degrees of Lewdity Plus v0.772** using the existing **SugarCube 2 ModLoader** payload and the official **Aoki Utage + Mysterious v0.772** image package.

## Production build design

The repository keeps the generated site reproducible without committing the 68 MB game HTML to `main`.

The production workflow:

1. Downloads the official `DoLP_aoki_utage_mys_v0.772.zip` package and verifies its exact size and SHA-256.
2. Publishes the package's complete `img/` tree as same-origin static assets.
3. Reconstructs the exact user-provided v0.772 ModLoader HTML:
   - starts from the official v0.772 HTML,
   - applies the ModLoader SugarCube startup patch with pinned `cheerio@1.0.0-rc.12`,
   - applies the original `insert2html` CSP behavior,
   - reuses the two verified embedded ModLoader blocks,
   - requires the final HTML to match the user-provided v0.772 file byte-for-byte.
4. Compresses the exact HTML to `payload/game-v0772.bundle`.
5. Publishes the launcher, Service Worker, exact bundle, complete official image tree, and supporting files to `gh-pages`.
6. The Service Worker serves `game-v0772.html` by decompressing the verified gzip bundle in-browser. Images are normal same-origin static files and are not proxied through an external image CDN.

## Verified exact core

- Game marker: `0.5.12.6 DoLP v0.772`
- Uncompressed size: `68,512,914` bytes
- SHA-256: `6e792d8fd8992e74df8906b091495abc61582602e8d88eb6b32680e94635ef8d`
- ModLoader payload marker: `window.modDataValueZipList`
- Embedded Mod ZIP count: `23`

The reconstructed production core must match the exact user-provided v0.772 ModLoader HTML. A size or SHA mismatch fails the build.

## Official Aoki+Mysterious v0.772 assets

- Package: `DoLP_aoki_utage_mys_v0.772.zip`
- Package SHA-256: `27227b0fa2f56e4cf2b4b8cacbc908ba2f0904f7a7b745b21b87e056dd7daf32`
- Published image files: `30,917`
- Published image bytes: `136,833,204`

A production audit compares every published image against the official package by relative path, size, and SHA-256.

## Optional external files

The exact game/ModLoader core requests several optional root-level files. GitHub Pages supplies safe stubs so a missing optional file is not returned as an HTML 404 page:

- `modList.json` → empty remote Mod list (`[]`)
- `style.css` → intentionally empty optional stylesheet
- `usettings.js` → intentionally empty optional SugarCube user settings

These files are outside the exact game HTML and do not alter the verified core SHA.

## Published branch

Generated site output is written to the `gh-pages` branch. Important files include:

- `index.html`
- `game-v0772.html`
- `sw.js`
- `pako_inflate.min.js`
- `payload/game-v0772.bundle`
- `img/...`
- `modList.json`
- `style.css`
- `usettings.js`
- `build-info.json`

The old `game-v0768.html` and `payload/game-v0768.bundle` are not part of the current published tree.

## Browser verification

The public deployment has been exercised in:

- headless Chromium with Service Worker enabled,
- Playwright WebKit as a Safari/WebKit compatibility check,
- direct public HTTP probes.

The WebKit test is useful for Safari compatibility but is not identical to a real iPhone Safari environment. iOS Safari remains the final device-level check for WebKit version, memory pressure, caching, and OS-specific behavior.

## Known upstream v0.772 observations

The official v0.772 Aoki+Mysterious package is byte-for-byte mirrored by the published image tree. Two image paths referenced by the v0.772 game are not present in that official package:

- `img/ui/wolf-harmony.png`
- `img/sex/machine/vaginal/xray_vaginal.png`

The first is requested during startup as a canvas image pattern and currently produces a 404. The second is only relevant to a specific x-ray rendering path. These are tracked as upstream asset-reference gaps rather than website-copy omissions.

The exact v0.772 ModLoader HTML also logs a caught `window.initI10n is not a function` error after the main SugarCube startup has already proceeded. The production build leaves the exact core unchanged rather than patching this non-fatal behavior.

## GitHub Pages

Deploy from the `gh-pages` branch at `/ (root)`.

Public site:

`https://yfei2304-dotcom.github.io/dolp-aoki-mys-modloader/`
