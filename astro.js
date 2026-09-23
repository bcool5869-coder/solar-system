// Planet positions for the solar system and the Jyotish panel.
//
// Planets: JPL "Keplerian elements for approximate positions of the major
// planets" (E. M. Standish), valid 1800–2050, J2000 ecliptic and equinox.
// Moon: the main periodic terms of Meeus, Astronomical Algorithms ch. 47.
// Typical error is well under a quarter of a degree for every body, far
// smaller than one nakshatra pada (3°20′).

const D2R = Math.PI / 180;
const norm = x => ((x % 360) + 360) % 360;

//            a (AU)        e            I (deg)       L (deg)         long.peri      long.node
//            and their rates per Julian century
const EL = {
  mercury: [[0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593],
            [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081]],
  venus:   [[0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255],
            [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418]],
  earth:   [[1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
            [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0]],
  mars:    [[1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
            [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343]],
  jupiter: [[5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
            [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106]],
  saturn:  [[9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
            [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794]],
  uranus:  [[19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503],
            [-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589]],
  neptune: [[30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574],
            [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664]],
};

// Heliocentric ecliptic position in AU. `days` = days since J2000.0.
export function helio(id, days) {
  const T = days / 36525, [e0, r] = EL[id];
  const a = e0[0] + r[0] * T, e = e0[1] + r[1] * T, I = (e0[2] + r[2] * T) * D2R;
  const L = e0[3] + r[3] * T, peri = e0[4] + r[4] * T, node = e0[5] + r[5] * T;
  const w = (peri - node) * D2R, N = node * D2R;
  const M = norm(L - peri) * D2R;
  let E = M + e * Math.sin(M);
  for (let k = 0; k < 8; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cw = Math.cos(w), sw = Math.sin(w), cN = Math.cos(N), sN = Math.sin(N), cI = Math.cos(I), sI = Math.sin(I);
  return {
    x: (cw * cN - sw * sN * cI) * xp + (-sw * cN - cw * sN * cI) * yp,
    y: (cw * sN + sw * cN * cI) * xp + (-sw * sN + cw * cN * cI) * yp,
    z: (sw * sI) * xp + (cw * sI) * yp,
  };
}

// Moon's geocentric ecliptic longitude (tropical, degrees).
const MOON_TERMS = [ // D, M, M', F, coefficient (1e-6 deg)
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528], [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390], [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236],
  [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069],
];
export function moonLongitude(days) {
  const T = days / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T;
  const D = (297.8501921 + 445267.1114034 * T) * D2R;
  const M = (357.5291092 + 35999.0502909 * T) * D2R;
  const Mp = (134.9633964 + 477198.8675055 * T) * D2R;
  const F = (93.2720950 + 483202.0175233 * T) * D2R;
  const Ecc = 1 - 0.002516 * T;
  let s = 0;
  for (const [d, m, mp, f, c] of MOON_TERMS) {
    const k = Math.abs(m) === 1 ? Ecc : Math.abs(m) === 2 ? Ecc * Ecc : 1;
    s += c * k * Math.sin(d * D + m * M + mp * Mp + f * F);
  }
  // Venus and Jupiter perturbations + flattening term (Meeus A1, A2)
  const A1 = (119.75 + 131.849 * T) * D2R, A2 = (53.09 + 479264.290 * T) * D2R;
  s += 3958 * Math.sin(A1) + 1962 * Math.sin(Lp * D2R - F) + 318 * Math.sin(A2);
  return norm(Lp + s / 1e6);
}

// Mean lunar node (Rahu). Ketu is always opposite.
export const rahuLongitude = days => norm(125.0445479 - 1934.1362891 * (days / 36525) + 0.0020754 * (days / 36525) ** 2);

// Lahiri (Chitrapaksha) ayanamsa, degrees.
export const ayanamsa = days => 23.85306 + precession(days);

// General precession in longitude since J2000. The planet elements are in the
// fixed J2000 frame, but the tropical zodiac is measured from the equinox of date.
export const precession = days => { const T = days / 36525; return 1.396971 * T + 0.0003086 * T * T; };

// Tropical geocentric longitude of any graha, equinox of date.
export function geoLongitude(id, days) {
  if (id === 'moon') return moonLongitude(days);
  if (id === 'rahu') return rahuLongitude(days);
  if (id === 'ketu') return norm(rahuLongitude(days) + 180);
  const e = helio('earth', days);
  if (id === 'sun') return norm(Math.atan2(-e.y, -e.x) / D2R + precession(days));
  const p = helio(id, days);
  return norm(Math.atan2(p.y - e.y, p.x - e.x) / D2R + precession(days));
}

export const RASHIS = [
  ['Mesha', 'Aries', 'Mangal'], ['Vrishabha', 'Taurus', 'Shukra'], ['Mithuna', 'Gemini', 'Budh'],
  ['Karka', 'Cancer', 'Chandra'], ['Simha', 'Leo', 'Surya'], ['Kanya', 'Virgo', 'Budh'],
  ['Tula', 'Libra', 'Shukra'], ['Vrischika', 'Scorpio', 'Mangal'], ['Dhanu', 'Sagittarius', 'Guru'],
  ['Makara', 'Capricorn', 'Shani'], ['Kumbha', 'Aquarius', 'Shani'], ['Meena', 'Pisces', 'Guru'],
];
export const NAKSHATRAS = [
  ['Ashwini', 'Ketu'], ['Bharani', 'Shukra'], ['Krittika', 'Surya'], ['Rohini', 'Chandra'],
  ['Mrigashira', 'Mangal'], ['Ardra', 'Rahu'], ['Punarvasu', 'Guru'], ['Pushya', 'Shani'],
  ['Ashlesha', 'Budh'], ['Magha', 'Ketu'], ['Purva Phalguni', 'Shukra'], ['Uttara Phalguni', 'Surya'],
  ['Hasta', 'Chandra'], ['Chitra', 'Mangal'], ['Swati', 'Rahu'], ['Vishakha', 'Guru'],
  ['Anuradha', 'Shani'], ['Jyeshtha', 'Budh'], ['Mula', 'Ketu'], ['Purva Ashadha', 'Shukra'],
  ['Uttara Ashadha', 'Surya'], ['Shravana', 'Chandra'], ['Dhanishta', 'Mangal'], ['Shatabhisha', 'Rahu'],
  ['Purva Bhadrapada', 'Guru'], ['Uttara Bhadrapada', 'Shani'], ['Revati', 'Budh'],
];
export const GRAHAS = [
  ['sun', 'Surya', 'Sun', 'Su'], ['moon', 'Chandra', 'Moon', 'Mo'], ['mars', 'Mangal', 'Mars', 'Ma'],
  ['mercury', 'Budh', 'Mercury', 'Me'], ['jupiter', 'Guru', 'Jupiter', 'Ju'], ['venus', 'Shukra', 'Venus', 'Ve'],
  ['saturn', 'Shani', 'Saturn', 'Sa'], ['rahu', 'Rahu', 'North node', 'Ra'], ['ketu', 'Ketu', 'South node', 'Ke'],
  ['uranus', 'Uranus', 'Uranus', 'Ur'], ['neptune', 'Neptune', 'Neptune', 'Ne'],
];

const NAK = 360 / 27, PADA = NAK / 4;

// Everything the Jyotish panel shows for one graha at one moment.
export function jyotish(id, days) {
  const trop = geoLongitude(id, days);
  const sid = norm(trop - ayanamsa(days));
  const rashi = Math.floor(sid / 30), nak = Math.floor(sid / NAK);
  const pada = Math.floor((sid - nak * NAK) / PADA) + 1;
  let retro = id === 'rahu' || id === 'ketu';
  if (!retro && id !== 'sun' && id !== 'moon') {
    const d = norm(geoLongitude(id, days + 0.5) - geoLongitude(id, days - 0.5) + 180) - 180;
    retro = d < 0;
  }
  return { trop, sid, rashi, inSign: sid - rashi * 30, nak, pada, retro };
}

// 155.8 -> 155°48′ ; with seconds -> 155°48′12″
export function dms(x, secs = false) {
  let d = Math.floor(x), mf = (x - d) * 60, m = Math.floor(mf), s = Math.round((mf - m) * 60);
  if (s === 60) { s = 0; m++; }
  if (!secs && mf - m >= 0.5) m++;
  if (m === 60) { m = 0; d++; }
  const pad = n => String(n).padStart(2, '0');
  return secs ? `${d}°${pad(m)}′${pad(s)}″` : `${d}°${pad(m)}′`;
}
