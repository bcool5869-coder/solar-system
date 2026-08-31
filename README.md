# Solar System

An animated solar system that runs in the browser. Single self-contained `index.html` — no build step, no dependencies.

**Live:** https://bcool5869-coder.github.io/solar-system/

## What's in it

- The Sun, rotating on its axis and wobbling around the barycenter as Jupiter and Saturn pull on it
- All 8 planets orbiting at speeds scaled to their real orbital periods
- Moons around Earth, Mars, Jupiter, and Saturn
- Rings on Saturn and Uranus
- A parallax starfield streaming past as the whole system travels

## The two views

**Helical (default).** The Sun is hauling the whole system around the galactic
centre at ~230 km/s, and the solar apex — the direction it's heading — sits
roughly 60° out of the ecliptic. So the planets sweep across the line of motion
and trail out behind as corkscrews instead of tracing closed loops.

Orbits are built as real circles in 3D and rotated by that 60°, so the tilt is
an actual angle rather than a squashed axis. That's why the orbit paths render
as rotated ellipses rather than axis-aligned ones, and why the rings on Saturn
and Uranus sit in the same plane.

**Flat.** The familiar top-down chart view, with the disc lying flat. Same
projection, tilt set to 0.

The inner planets wind tight helices; Neptune's is nearly a straight line,
because it barely moves along its orbit in the time the Sun covers that ground.

## Controls

| Control | What it does |
|---|---|
| Speed slider | Speeds up or freezes time |
| Zoom slider / scroll | Zoom in and out |
| Drag | Pan the view |
| View | Switch between helical and flat |
| Orbit paths | Show or hide the orbit ellipses |
| Helix trails | Show or hide the trails behind each planet |
| Panel header / `H` | Collapse or restore the control panel |

The readout tracks elapsed years, distance covered around the galaxy, and how
much of one galactic orbit that adds up to. A full lap takes ~230 million years,
so that last number stays comically small.

## Running locally

Open `index.html` in any browser. That's it.
