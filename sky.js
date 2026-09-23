// Rashis and nakshatras as glowing star figures in the sky.
//
// Each figure is drawn from the real stars of its constellation or asterism, at
// their true ecliptic positions (J2000). They sit on a huge sphere that moves with
// the camera, so they read as the distant sky behind the planets, the way they
// look from Earth.
import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const D2R = Math.PI / 180, OBL = 23.4393 * D2R;
const RADIUS = 4000;         // far beyond Neptune, inside the Milky Way backdrop

// Rashis. [name, RA hours, Dec degrees, magnitude]; lines index into the star list.
const CONSTELLATIONS = [
  { rashi: 0, name: 'Mesha', en: 'Aries', stars: [
      ['Hamal', 2.12, 23.46, 2.0], ['Sheratan', 1.91, 20.81, 2.6], ['Mesartim', 1.89, 19.29, 3.9], ['41 Ari', 2.83, 27.26, 3.6]],
    lines: [[2, 1], [1, 0], [0, 3]] },
  { rashi: 1, name: 'Vrishabha', en: 'Taurus', stars: [
      ['Aldebaran', 4.60, 16.51, 0.9], ['Elnath', 5.44, 28.61, 1.7], ['Tianguan', 5.63, 21.14, 3.0], ['Prima Hyadum', 4.33, 15.63, 3.6],
      ['δ Tau', 4.38, 17.54, 3.8], ['Ain', 4.48, 19.18, 3.5], ['θ Tau', 4.48, 15.87, 3.4], ['λ Tau', 4.01, 12.49, 3.5], ['ο Tau', 3.41, 9.03, 3.6],
      ['Alcyone', 3.79, 24.11, 2.9], ['Atlas', 3.82, 24.05, 3.6], ['Electra', 3.75, 24.11, 3.7], ['Maia', 3.76, 24.37, 3.9], ['Merope', 3.77, 23.95, 4.1], ['Taygeta', 3.75, 24.47, 4.3]],
    lines: [[2, 0], [0, 6], [6, 3], [3, 7], [7, 8], [1, 5], [5, 4], [4, 3]] },
  { rashi: 2, name: 'Mithuna', en: 'Gemini', stars: [
      ['Castor', 7.58, 31.89, 1.6], ['Pollux', 7.76, 28.03, 1.1], ['Alhena', 6.63, 16.40, 1.9], ['Mebsuta', 6.73, 25.13, 3.0],
      ['Tejat', 6.38, 22.51, 2.9], ['Propus', 6.25, 22.51, 3.3], ['Wasat', 7.34, 21.98, 3.5], ['Mekbuda', 7.07, 20.57, 3.9],
      ['τ Gem', 7.19, 30.25, 4.4], ['θ Gem', 6.88, 33.96, 3.6], ['ι Gem', 7.43, 27.80, 3.8], ['λ Gem', 7.30, 16.54, 3.6], ['ξ Gem', 6.75, 12.90, 3.4]],
    lines: [[0, 8], [8, 9], [8, 3], [3, 4], [4, 5], [8, 10], [10, 1], [1, 6], [6, 7], [7, 2], [6, 11], [11, 12]] },
  { rashi: 3, name: 'Karka', en: 'Cancer', stars: [
      ['Acubens', 8.97, 11.86, 4.3], ['Altarf', 8.28, 9.19, 3.5], ['Asellus Australis', 8.74, 18.15, 3.9], ['Asellus Borealis', 8.72, 21.47, 4.7],
      ['ι Cnc', 8.78, 28.76, 4.0], ['Praesepe', 8.67, 19.67, 3.7]],
    lines: [[1, 2], [2, 0], [2, 3], [3, 4]] },
  { rashi: 4, name: 'Simha', en: 'Leo', stars: [
      ['Regulus', 10.14, 11.97, 1.4], ['η Leo', 10.12, 16.76, 3.5], ['Algieba', 10.33, 19.84, 2.0], ['Adhafera', 10.28, 23.42, 3.4],
      ['Rasalas', 9.88, 26.01, 3.9], ['Algenubi', 9.76, 23.77, 3.0], ['Zosma', 11.24, 20.52, 2.6], ['Chertan', 11.24, 15.43, 3.3], ['Denebola', 11.82, 14.57, 2.1]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 8], [8, 7], [7, 0], [6, 7]] },
  { rashi: 5, name: 'Kanya', en: 'Virgo', stars: [
      ['Spica', 13.42, -11.16, 1.0], ['Porrima', 12.69, -1.45, 2.7], ['Minelauva', 12.93, 3.40, 3.4], ['Vindemiatrix', 13.04, 10.96, 2.8],
      ['Heze', 13.58, -0.60, 3.4], ['Zavijava', 11.84, 1.76, 3.6], ['Zaniah', 12.33, -0.67, 3.9], ['Syrma', 14.27, -6.00, 4.1],
      ['Rijl al Awwa', 14.72, -5.66, 3.9], ['θ Vir', 13.16, -5.54, 4.4]],
    lines: [[5, 6], [6, 1], [1, 2], [2, 3], [1, 9], [9, 0], [2, 4], [4, 7], [7, 8]] },
  { rashi: 6, name: 'Tula', en: 'Libra', stars: [
      ['Zubenelgenubi', 14.85, -16.04, 2.8], ['Zubeneschamali', 15.28, -9.38, 2.6], ['Brachium', 15.07, -25.28, 3.3],
      ['Zubenelhakrabi', 15.59, -14.79, 3.9], ['υ Lib', 15.62, -28.14, 3.6], ['τ Lib', 15.64, -29.78, 3.7]],
    lines: [[0, 1], [1, 3], [3, 0], [0, 2], [3, 4], [4, 5]] },
  { rashi: 7, name: 'Vrischika', en: 'Scorpius', stars: [
      ['Antares', 16.49, -26.43, 1.0], ['Dschubba', 16.01, -22.62, 2.3], ['Acrab', 16.09, -19.81, 2.6], ['Fang', 15.98, -26.11, 2.9],
      ['Alniyat', 16.35, -25.59, 2.9], ['Paikauhale', 16.60, -28.22, 2.8], ['Larawag', 16.84, -34.29, 2.3], ['Xamidimura', 16.86, -38.05, 3.0],
      ['ζ Sco', 16.91, -42.36, 3.6], ['η Sco', 17.20, -43.24, 3.3], ['Sargas', 17.62, -43.00, 1.9], ['ι Sco', 17.79, -40.13, 3.0],
      ['Girtab', 17.71, -39.03, 2.4], ['Shaula', 17.56, -37.10, 1.6], ['Lesath', 17.51, -37.30, 2.7]],
    lines: [[2, 1], [1, 3], [1, 4], [4, 0], [0, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14]] },
  { rashi: 8, name: 'Dhanu', en: 'Sagittarius', stars: [
      ['Kaus Australis', 18.40, -34.38, 1.8], ['Nunki', 18.92, -26.30, 2.1], ['Ascella', 19.04, -29.88, 2.6], ['Kaus Media', 18.35, -29.83, 2.7],
      ['Kaus Borealis', 18.47, -25.42, 2.8], ['Alnasl', 18.10, -30.42, 3.0], ['φ Sgr', 18.76, -26.99, 3.2], ['τ Sgr', 19.12, -27.67, 3.3],
      ['η Sgr', 18.29, -36.76, 3.1], ['Albaldah', 19.16, -21.02, 2.9], ['Polis', 18.23, -21.06, 3.8]],
    lines: [[5, 3], [3, 0], [0, 5], [3, 4], [4, 6], [6, 3], [6, 2], [2, 0], [6, 1], [1, 7], [7, 2], [4, 10], [1, 9], [0, 8]] },
  { rashi: 9, name: 'Makara', en: 'Capricornus', stars: [
      ['Algedi', 20.30, -12.54, 3.6], ['Dabih', 20.35, -14.78, 3.1], ['ψ Cap', 20.77, -25.27, 4.1], ['ω Cap', 20.86, -26.92, 4.1],
      ['ζ Cap', 21.44, -22.41, 3.7], ['Deneb Algedi', 21.78, -16.13, 2.9], ['Nashira', 21.67, -16.66, 3.7], ['ι Cap', 21.37, -16.83, 4.3], ['θ Cap', 21.10, -17.23, 4.1]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0]] },
  { rashi: 10, name: 'Kumbha', en: 'Aquarius', stars: [
      ['Sadalsuud', 21.53, -5.57, 2.9], ['Sadalmelik', 22.10, -0.32, 3.0], ['Sadachbia', 22.36, -1.39, 3.8], ['ζ Aqr', 22.48, -0.02, 3.7],
      ['η Aqr', 22.59, -0.12, 4.0], ['π Aqr', 22.42, 1.38, 4.7], ['Ancha', 22.28, -7.78, 4.2], ['λ Aqr', 22.88, -7.58, 3.7],
      ['Skat', 22.91, -15.82, 3.3], ['Albali', 20.79, -9.50, 3.8], ['ι Aqr', 22.11, -13.87, 4.3], ['φ Aqr', 23.24, -6.05, 4.2],
      ['ψ¹ Aqr', 23.26, -9.09, 4.2], ['88 Aqr', 23.16, -21.17, 3.7], ['98 Aqr', 23.38, -20.10, 3.9]],
    lines: [[9, 0], [0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [1, 6], [6, 7], [7, 11], [7, 8], [0, 10], [11, 12], [12, 14], [8, 13]] },
  { rashi: 11, name: 'Meena', en: 'Pisces', stars: [
      ['Alpherg', 1.52, 15.35, 3.6], ['Alrescha', 2.03, 2.76, 3.8], ['ο Psc', 1.75, 9.16, 4.3], ['ν Psc', 1.69, 5.49, 4.4],
      ['μ Psc', 1.50, 6.14, 4.8], ['ε Psc', 1.05, 7.89, 4.3], ['δ Psc', 0.81, 7.59, 4.4], ['ω Psc', 23.99, 6.86, 4.0],
      ['ι Psc', 23.67, 5.63, 4.1], ['θ Psc', 23.47, 6.38, 4.3], ['Fumalsamakah', 23.29, 3.28, 3.7], ['κ Psc', 23.45, 1.26, 4.9],
      ['λ Psc', 23.70, 1.78, 4.5], ['τ Psc', 1.19, 30.09, 4.5], ['υ Psc', 1.33, 27.26, 4.8], ['φ Psc', 1.23, 24.58, 4.7], ['χ Psc', 1.19, 21.03, 4.7]],
    lines: [[10, 9], [9, 8], [8, 12], [12, 11], [11, 10], [8, 7], [7, 6], [6, 5], [5, 4], [4, 3], [3, 1], [1, 2], [2, 0], [0, 16], [16, 15], [15, 14], [14, 13], [13, 15]] },
];

// The 27 nakshatras as their traditional asterisms (yogatara groups).
// Single-star nakshatras (Ardra, Chitra, Swati) have no lines, just a bigger glow.
const NAK_STARS = [
  { name: 'Ashwini', stars: [['Sheratan', 1.91, 20.81, 2.6], ['Mesartim', 1.89, 19.29, 3.9], ['Hamal', 2.12, 23.46, 2.0]], lines: [[1, 0], [0, 2]] },
  { name: 'Bharani', stars: [['35 Ari', 2.72, 27.71, 4.7], ['39 Ari', 2.80, 29.25, 4.5], ['41 Ari', 2.83, 27.26, 3.6]], lines: [[0, 1], [1, 2], [2, 0]] },
  { name: 'Krittika', stars: [['Alcyone', 3.79, 24.11, 2.9], ['Atlas', 3.82, 24.05, 3.6], ['Electra', 3.75, 24.11, 3.7], ['Maia', 3.76, 24.37, 3.9], ['Merope', 3.77, 23.95, 4.1], ['Taygeta', 3.75, 24.47, 4.3]],
    lines: [[2, 5], [5, 3], [3, 0], [0, 1], [1, 4], [4, 2]] },
  { name: 'Rohini', stars: [['Aldebaran', 4.60, 16.51, 0.9], ['θ Tau', 4.48, 15.87, 3.4], ['Prima Hyadum', 4.33, 15.63, 3.6], ['δ Tau', 4.38, 17.54, 3.8], ['Ain', 4.48, 19.18, 3.5]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { name: 'Mrigashira', stars: [['Meissa', 5.59, 9.93, 3.5], ['φ¹ Ori', 5.58, 9.49, 4.4], ['φ² Ori', 5.61, 9.29, 4.1]], lines: [[0, 1], [1, 2], [2, 0]] },
  { name: 'Ardra', stars: [['Betelgeuse', 5.92, 7.41, 0.5]], lines: [] },
  { name: 'Punarvasu', stars: [['Castor', 7.58, 31.89, 1.6], ['Pollux', 7.76, 28.03, 1.1]], lines: [[0, 1]] },
  { name: 'Pushya', stars: [['Asellus Borealis', 8.72, 21.47, 4.7], ['Asellus Australis', 8.74, 18.15, 3.9], ['θ Cnc', 8.53, 18.09, 5.3]], lines: [[0, 1], [1, 2], [2, 0]] },
  { name: 'Ashlesha', stars: [['δ Hya', 8.63, 5.70, 4.2], ['ε Hya', 8.78, 6.42, 3.4], ['ζ Hya', 8.92, 5.95, 3.1], ['ρ Hya', 8.81, 5.84, 4.4], ['η Hya', 8.72, 3.40, 4.3], ['σ Hya', 8.65, 3.34, 4.4]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]] },
  { name: 'Magha', stars: [['Regulus', 10.14, 11.97, 1.4], ['η Leo', 10.12, 16.76, 3.5], ['Algieba', 10.33, 19.84, 2.0], ['Adhafera', 10.28, 23.42, 3.4], ['Rasalas', 9.88, 26.01, 3.9], ['Algenubi', 9.76, 23.77, 3.0]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
  { name: 'Purva Phalguni', stars: [['Zosma', 11.24, 20.52, 2.6], ['Chertan', 11.24, 15.43, 3.3]], lines: [[0, 1]] },
  { name: 'Uttara Phalguni', stars: [['Denebola', 11.82, 14.57, 2.1], ['93 Leo', 11.80, 20.22, 4.5]], lines: [[0, 1]] },
  { name: 'Hasta', stars: [['Gienah', 12.26, -17.54, 2.6], ['Algorab', 12.50, -16.52, 2.9], ['Kraz', 12.57, -23.40, 2.6], ['Minkar', 12.17, -22.62, 3.0], ['Alchiba', 12.14, -24.73, 4.0]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4]] },
  { name: 'Chitra', stars: [['Spica', 13.42, -11.16, 1.0]], lines: [] },
  { name: 'Swati', stars: [['Arcturus', 14.26, 19.18, 0.0]], lines: [] },
  { name: 'Vishakha', stars: [['Zubenelgenubi', 14.85, -16.04, 2.8], ['ι Lib', 15.20, -19.79, 4.5], ['Zubeneschamali', 15.28, -9.38, 2.6], ['Zubenelhakrabi', 15.59, -14.79, 3.9]],
    lines: [[1, 0], [0, 2], [2, 3]] },
  { name: 'Anuradha', stars: [['Acrab', 16.09, -19.81, 2.6], ['Dschubba', 16.01, -22.62, 2.3], ['Fang', 15.98, -26.11, 2.9]], lines: [[0, 1], [1, 2]] },
  { name: 'Jyeshtha', stars: [['Alniyat', 16.35, -25.59, 2.9], ['Antares', 16.49, -26.43, 1.0], ['Paikauhale', 16.60, -28.22, 2.8]], lines: [[0, 1], [1, 2]] },
  { name: 'Mula', stars: [['Larawag', 16.84, -34.29, 2.3], ['Xamidimura', 16.86, -38.05, 3.0], ['ζ Sco', 16.91, -42.36, 3.6], ['η Sco', 17.20, -43.24, 3.3], ['Sargas', 17.62, -43.00, 1.9],
      ['ι Sco', 17.79, -40.13, 3.0], ['Girtab', 17.71, -39.03, 2.4], ['Shaula', 17.56, -37.10, 1.6], ['Lesath', 17.51, -37.30, 2.7]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]] },
  { name: 'Purva Ashadha', stars: [['Kaus Media', 18.35, -29.83, 2.7], ['Kaus Australis', 18.40, -34.38, 1.8], ['Alnasl', 18.10, -30.42, 3.0]], lines: [[0, 1], [1, 2], [2, 0]] },
  { name: 'Uttara Ashadha', stars: [['Nunki', 18.92, -26.30, 2.1], ['τ Sgr', 19.12, -27.67, 3.3], ['Ascella', 19.04, -29.88, 2.6], ['φ Sgr', 18.76, -26.99, 3.2]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]] },
  { name: 'Shravana', stars: [['Tarazed', 19.77, 10.61, 2.7], ['Altair', 19.85, 8.87, 0.8], ['Alshain', 19.92, 6.41, 3.7]], lines: [[0, 1], [1, 2]] },
  { name: 'Dhanishta', stars: [['Rotanev', 20.63, 14.60, 3.6], ['Sualocin', 20.66, 15.91, 3.8], ['γ Del', 20.78, 16.12, 3.9], ['δ Del', 20.72, 15.07, 4.4], ['ε Del', 20.55, 11.30, 4.0]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4]] },
  { name: 'Shatabhisha', stars: [['λ Aqr', 22.88, -7.58, 3.7], ['φ Aqr', 23.24, -6.05, 4.2], ['χ Aqr', 23.28, -7.73, 5.0], ['ψ¹ Aqr', 23.26, -9.09, 4.2]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]] },
  { name: 'Purva Bhadrapada', stars: [['Markab', 23.08, 15.21, 2.5], ['Scheat', 23.06, 28.08, 2.4]], lines: [[0, 1]] },
  { name: 'Uttara Bhadrapada', stars: [['Algenib', 0.22, 15.18, 2.8], ['Alpheratz', 0.14, 29.09, 2.1]], lines: [[0, 1]] },
  { name: 'Revati', stars: [['δ Psc', 0.81, 7.59, 4.4], ['ε Psc', 1.05, 7.89, 4.3], ['ζ Psc', 1.23, 7.58, 5.2], ['μ Psc', 1.50, 6.14, 4.8]], lines: [[0, 1], [1, 2], [2, 3]] },
];
const LORDS = ['Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangal', 'Rahu', 'Guru', 'Shani', 'Budh'];
const fmtDeg = x => { const d = Math.floor(x + 1e-9), m = Math.round((x - d) * 60); return m ? `${d}°${String(m).padStart(2, '0')}′` : `${d}°`; };

// Painted rashi figures (Qwen Image 2.1, 2048px WebP), in rashi order.
const ART = ['01-mesha', '02-vrishabha', '03-mithuna', '04-karka', '05-simha', '06-kanya',
  '07-tula', '08-vrischika', '09-dhanu', '10-makara', '11-kumbha', '12-meena'];

const FIGURES = {
  rashi: CONSTELLATIONS.map(C => ({ idx: C.rashi, name: C.name, sub: `${C.en} · ${C.rashi * 30}°–${C.rashi * 30 + 30}°`, stars: C.stars, lines: C.lines })),
  nakshatra: NAK_STARS.map((N, i) => ({ idx: i, name: N.name, stars: N.stars, lines: N.lines,
    sub: `${fmtDeg(i * 40 / 3)}–${fmtDeg((i + 1) * 40 / 3)} · ${LORDS[i % 9]}` })),
};

// blue → violet → gold, cycling
const PALETTE = [0x7fb2ff, 0xb48cff, 0xf3c77a];

function eclipticDir(raH, decD, out) {
  const a = raH * 15 * D2R, d = decD * D2R;
  const sb = Math.sin(d) * Math.cos(OBL) - Math.cos(d) * Math.sin(OBL) * Math.sin(a);
  const b = Math.asin(sb), l = Math.atan2(Math.sin(a) * Math.cos(OBL) + Math.tan(d) * Math.sin(OBL), Math.cos(a));
  // ecliptic (x, y, z-north) -> scene (x, z, -y), same as the planets
  return out.set(Math.cos(b) * Math.cos(l), Math.sin(b), -Math.cos(b) * Math.sin(l));
}

function glowTex() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.12, 'rgba(255,255,255,.9)');
  r.addColorStop(.3, 'rgba(255,255,255,.28)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// soft wispy cloud, made once and reused (tinted and rotated) behind every figure
let nebCache = null;
function nebulaTex() {
  if (nebCache) return nebCache;
  const N = 256, c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d'), img = g.createImageData(N, N);
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const G = 17, grid = Array.from({ length: G * G }, rnd);
  const at = (x, y) => grid[((y % G + G) % G) * G + ((x % G + G) % G)];
  const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return (at(xi, yi) * (1 - u) + at(xi + 1, yi) * u) * (1 - v) + (at(xi, yi + 1) * (1 - u) + at(xi + 1, yi + 1) * u) * v; };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let f = 0, amp = .5, fr = 4 / N;
    for (let o = 0; o < 5; o++) { f += amp * vn(x * fr, y * fr); amp *= .5; fr *= 2; }
    const dx = x / N - .5, dy = y / N - .5, fall = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) * 2);
    const a = Math.pow(Math.max(0, f - .35) * 1.9, 1.6) * fall * fall;
    const i = (y * N + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = 255; img.data[i + 3] = Math.min(255, a * 255);
  }
  g.putImageData(img, 0, 0);
  return (nebCache = new THREE.CanvasTexture(c));
}

// kind: 'rashi' | 'nakshatra'. The figures sit on a huge sphere that travels with
// the camera, so they read as the real, infinitely distant sky behind the planets.
export function createSky(labelsEl, kind, onLabelClick) {
  const figs = FIGURES[kind];
  const group = new THREE.Group();
  group.visible = false;
  group.renderOrder = -1;
  const glow = glowTex(), neb = nebulaTex();
  const starMat = new THREE.ShaderMaterial({
    uniforms: { map: { value: glow }, opacity: { value: 0 }, time: { value: 0 }, scale: { value: 1 } },
    vertexShader: `
      attribute float size; attribute vec3 color; attribute float phase; attribute float boost;
      uniform float time, scale; varying vec3 vC; varying float vA;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.);
        float tw = .82 + .18 * sin(time * (1.3 + phase) + phase * 17.);
        vC = color; vA = tw * boost;
        gl_PointSize = size * scale * (.9 + .1 * tw) * (.8 + .2 * boost);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform sampler2D map; uniform float opacity; varying vec3 vC; varying float vA;
      void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vC * 2.2 * t.a, 1.) * opacity * vA; }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });

  const items = [];
  const cen = new THREE.Vector3();
  const pos = [], col = [], size = [], phase = [], boost = [], owner = [];

  figs.forEach((F, ci) => {
    const color = new THREE.Color(PALETTE[ci % 3]);
    const next = new THREE.Color(PALETTE[(ci + 1) % 3]);
    const pts = F.stars.map(([, ra, dec]) => eclipticDir(ra, dec, new THREE.Vector3()).multiplyScalar(RADIUS));
    cen.set(0, 0, 0); pts.forEach(p => cen.add(p)); cen.normalize().multiplyScalar(RADIUS);
    const lone = F.lines.length === 0;

    F.stars.forEach(([, , , mag], i) => {
      pos.push(pts[i].x, pts[i].y, pts[i].z);
      const tint = new THREE.Color(0xffffff).lerp(i % 2 ? color : next, .35 + mag * .06);
      col.push(tint.r, tint.g, tint.b);
      size.push(Math.max(5, 26 - mag * 4.2) * (lone ? 1.7 : 1));   // pixels at 900px viewport height
      phase.push((ci * 7 + i * 3) % 11 / 11);
      boost.push(1); owner.push(ci);
    });

    let lm = null, hm = null;
    if (!lone) {
      const lp = [], lc = [];
      for (const [a, b] of F.lines) {
        lp.push(pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z);
        lc.push(color.r, color.g, color.b, next.r, next.g, next.b);
      }
      const lg = new LineSegmentsGeometry(); lg.setPositions(lp); lg.setColors(lc);
      lm = new LineMaterial({ linewidth: 1, vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
      hm = new LineMaterial({ linewidth: 3.5, vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
      const a = new LineSegments2(lg, lm), b = new LineSegments2(lg, hm);
      a.frustumCulled = b.frustumCulled = false;
      group.add(a, b);
    }

    // nebula wash behind the figure
    let spread = 0; pts.forEach(p => { spread = Math.max(spread, p.distanceTo(cen)); });
    spread = Math.max(spread, RADIUS * .07);
    const nm = new THREE.SpriteMaterial({ map: neb, color: ci % 3 === 2 ? 0x8a6cff : ci % 3 === 1 ? 0xa05cff : 0x4f7dff,
      transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, rotation: ci * 1.7 });
    const cloud = new THREE.Sprite(nm);
    cloud.position.copy(cen).multiplyScalar(1.02);
    cloud.scale.setScalar(spread * 3);
    group.add(cloud);

    // the painted figure, glowing over its own stars (black background drops out additively)
    let am = null;
    if (kind === 'rashi') {
      am = new THREE.SpriteMaterial({ transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xd8d8e8 });
      const art = new THREE.Sprite(am);
      art.position.copy(cen).multiplyScalar(1.01);
      art.scale.setScalar(spread * 2.7);
      art.visible = false;          // until its texture has loaded
      group.add(art);
      am.userData.sprite = art;
      am.userData.file = ART[F.idx];
    }

    // label just below the figure's lowest star
    const low = pts.reduce((m, p) => (p.y < m.y ? p : m), pts[0]);
    const anchor = cen.clone().setY(low.y).normalize().multiplyScalar(RADIUS);
    const el = document.createElement('button');
    el.className = 'sky-lbl ' + kind;
    el.innerHTML = `<b>${F.name}</b><span>${F.sub}</span><em></em>`;
    el.onclick = () => onLabelClick && onLabelClick(F.idx);
    el.style.display = 'none';
    labelsEl.appendChild(el);

    items.push({ F, lm, hm, nm, am, el, tag: el.querySelector('em'), center: cen.clone(), anchor, delay: 0, hot: false });
  });

  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  pg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  pg.setAttribute('size', new THREE.Float32BufferAttribute(size, 1));
  pg.setAttribute('phase', new THREE.Float32BufferAttribute(phase, 1));
  pg.setAttribute('boost', new THREE.Float32BufferAttribute(boost, 1));
  const points = new THREE.Points(pg, starMat);
  points.frustumCulled = false;
  group.add(points);

  let target = 0, fade = 0, time = 0, artLoaded = false;
  // paintings load the first time the rashi sky is shown, not with the page
  function loadArt() {
    if (artLoaded || kind !== 'rashi') return;
    artLoaded = true;
    const loader = new THREE.TextureLoader();
    for (const r of items) {
      loader.load(`textures/rashi/${r.am.userData.file}.webp`, tex => {
        tex.colorSpace = THREE.SRGBColorSpace;
        r.am.map = tex; r.am.needsUpdate = true;
        r.am.userData.sprite.visible = true;
      });
    }
  }
  const v = new THREE.Vector3();

  return {
    group,
    show(on, camera) {
      if (on && target === 0) {
        group.visible = true;
        loadArt();
        // reveal starting with whatever the camera is looking at, rippling outwards
        const fwd = camera.getWorldDirection(new THREE.Vector3());
        items.forEach(r => { r.delay = (1 - fwd.dot(v.copy(r.center).normalize())) * .7; });
      }
      target = on ? 1 : 0;
    },
    // vanish at once (used when switching between rashi and nakshatra, so they never overlap)
    hideNow() {
      target = 0; fade = 0;
      group.visible = false;
      items.forEach(r => { r.el.style.display = 'none'; });
    },
    // hot: figure index -> graha names sitting in it right now
    setOccupants(hot) {
      const b = pg.attributes.boost;
      items.forEach((r, ci) => {
        const names = hot[r.F.idx] || [];
        r.hot = names.length > 0;
        r.tag.textContent = names.join(' · ');
        for (let i = 0; i < owner.length; i++) if (owner[i] === ci) b.array[i] = r.hot ? 1.7 : 1;
      });
      b.needsUpdate = true;
    },
    update(dt, camera, width, height) {
      fade += (target - fade) * Math.min(1, dt * (target ? 1.1 : 3));
      if (target === 0 && fade < .01) {
        if (group.visible) { group.visible = false; items.forEach(r => { r.el.style.display = 'none'; }); }
        return;
      }
      time += dt;
      group.position.copy(camera.position);            // always infinitely far away
      starMat.uniforms.time.value = time;
      starMat.uniforms.opacity.value = fade;
      starMat.uniforms.scale.value = height / 900;
      for (const r of items) {
        const k = THREE.MathUtils.clamp(fade * 1.9 - r.delay, 0, 1);
        if (r.lm) {
          r.lm.opacity = k * (r.hot ? 1 : .8);
          r.hm.opacity = k * (r.hot ? .22 : .12);
          r.lm.resolution.set(width, height); r.hm.resolution.set(width, height);
        }
        r.nm.opacity = k * (r.am ? (r.hot ? .22 : .12) : (r.hot ? .5 : .3));
        if (r.am) r.am.opacity = k * (r.hot ? .95 : .72);
        v.copy(r.anchor).add(camera.position).project(camera);
        const vis = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05 && k > .05;
        r.el.style.display = vis ? '' : 'none';
        if (vis) {
          r.el.style.opacity = k;
          r.el.classList.toggle('hot', r.hot);
          r.el.style.transform = `translate(${(v.x + 1) / 2 * width}px, ${(1 - v.y) / 2 * height + 26}px) translate(-50%, 0)`;
        }
      }
    },
  };
}
