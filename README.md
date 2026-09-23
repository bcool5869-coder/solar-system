# Solar System

A realistic, interactive 3D solar system that runs in the browser. `index.html`, `astro.js`,
`sky.js` and a `textures/` folder: no build step. Three.js loads from a CDN.

**Live:** https://bcool5869-coder.github.io/solar-system/

## What's in it

- The Sun with an animated, boiling surface, limb darkening and a bloom glow
- All 8 planets with real surface textures, axial tilts and spin directions
  (Venus and Uranus spin backwards)
- Earth with a day side, glowing city lights on the night side, drifting clouds,
  sun glint on the oceans and a blue atmosphere
- Saturn's rings, Uranus's faint rings, and atmospheres on Venus, Mars and the giants
- Moons: the Moon, Phobos, Deimos, Io, Europa, Ganymede, Callisto, Titan, Triton
- An asteroid belt of 3,200 rocks, and the real Milky Way in the background
- **Real positions.** Planets sit where they actually are on the date shown,
  worked out from their J2000 orbital elements. Press *Today* to jump back to now.

Distances and sizes are compressed so everything fits on screen. Orbital periods,
tilts, inclinations and spin rates are real.

## Jyotish: rashi, nakshatra, pada

Press **Jyotish** (or `J`) for a sidereal table of all nine grahas (Surya, Chandra,
Mangal, Budh, Guru, Shukra, Shani, Rahu, Ketu) plus Uranus and Neptune. For each one
it shows:

- **Rashi** and the degree inside it (e.g. Kanya 6°09′)
- **Nakshatra**, its lord, and the **pada** (1–4)
- Full sidereal **longitude** 0–360° from Mesha 0°
- **R** when the graha is retrograde

Pick any date and time, or press **Now**. Positions are geocentric, using the
Lahiri ayanamsa and mean Rahu/Ketu.

**Click Earth** and choose what to show in the sky (Earth's card, or `S` to cycle):

- **Rashi**: the twelve zodiac constellations, each drawn from its real stars
  (Mesha from Hamal and Sheratan, Dhanu's "teapot", Vrischika's curled tail with
  Antares, and so on) with a painted Vedic figure glowing behind them: Mesha's ram,
  Mithuna's couple with mace and veena, Kanya in her boat with flame and grain,
  Makara with a deer's head and fish's tail. The paintings (2048 px WebP, 5 MB for
  all twelve) load only the first time you open the rashi sky
- **Nakshatra**: all 27 nakshatras as their traditional star groups (Krittika is
  the Pleiades, Rohini is Aldebaran's "V", Hasta is the hand of Corvus, Shravana is
  Altair and its two companions, Chitra is Spica)
- **Off**

The figures sit far beyond the planets, at their true positions in the sky, so they
read as the real sky behind Earth. They're blue, violet and gold, each with its own
nebula glow. Any figure holding a graha right now shines gold with the graha named
under it. Drag to look around Earth and see them all.

**Zodiac ring** (or `Z`) draws the 12 rashis, 27 nakshatras with their padas and
every degree around Earth, with a bead marking each graha's true position.

Accuracy: planets come from NASA JPL's Keplerian elements (valid 1800–2050) and the
Moon from the main terms of Meeus' lunar theory. Checked against real events
(new/full moons, the 2024 equinox, Jupiter's Dec 2023 station, Saturn entering
Meena on 29 Mar 2025), everything lands within about 0.1°. That's plenty for rashi
and nakshatra, but a graha within a few arc-minutes of a boundary could show the
neighbouring pada, so check a proper panchang for anything important.

## Galactic motion

The Sun drags the whole system round the Milky Way at ~230 km/s, heading about 60°
out of the orbital plane. Turn on **Galactic motion** and the planets trail
corkscrews instead of closed loops: tight helices for the inner planets, a nearly
straight line for Neptune. The readout tracks how far the system has travelled.

## Controls

| Control | What it does |
|---|---|
| Drag / scroll / pinch | Orbit and zoom the camera |
| Click a planet, its label, or the bottom bar | Fly to it and show its facts |
| `0`–`8` | Jump to the Sun (0) or a planet (1–8) |
| `Esc` / × | Back to the overview |
| Time slider | From minutes per second up to 20 years per second |
| `Space` | Pause or play |
| Orbits / Labels | Show or hide orbit lines and names |
| `J` / Jyotish | Sidereal graha table |
| `Z` / Zodiac ring | Rashi and nakshatra ring around Earth |
| `H` | Hide all the UI for clean screenshots |

## Running locally

Browsers block textures on `file://` pages, so serve the folder:

```
python -m http.server
```

then open http://localhost:8000.

## Credits

Rashi paintings: generated locally with Qwen Image 2.1 in ComfyUI.

Planet and star textures: [Solar System Scope](https://www.solarsystemscope.com/textures/),
licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), based on NASA imagery.
