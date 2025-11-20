// harmony.js
// Small music-theory helper: given a tonic chord, return its dominant and subdominant.

// Internal note order (using sharps, flats are converted)
const NOTE_ORDER = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const FLAT_TO_SHARP = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

// ---- Helpers ---- //

function normalizeRoot(root) {
  // Convert flats to sharps if needed
  if (FLAT_TO_SHARP[root]) return FLAT_TO_SHARP[root];
  return root;
}

function parseChordName(chordName) {
  // Root is: letter A–G, optional # or b
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);
  if (!match) {
    throw new Error(`Invalid chord name: "${chordName}"`);
  }

  let [, rawRoot, rest] = match;
  const root = normalizeRoot(rawRoot);

  // Very simple quality detection:
  // contains "m" => minor, otherwise major
  let quality = "maj";
  const lowerRest = rest.toLowerCase();
  if (lowerRest.includes("m") && !lowerRest.includes("maj")) {
    quality = "min";
  }

  return { root, quality };
}

function transposePerfectInterval(root, semitones) {
  const index = NOTE_ORDER.indexOf(root);
  if (index === -1) {
    throw new Error(`Unknown root note: "${root}"`);
  }
  // Wrap around 0–11
  const newIndex = (index + semitones + 12) % 12;
  return NOTE_ORDER[newIndex];
}

// ---- Main API ---- //

export const getRandomScale = () => {
  const chordName = NOTE_ORDER[Math.floor(Math.random() * NOTE_ORDER.length)];
  return chordName;
};

export const getDominantAndSubdominant = (chordName) => {
  const { root, quality } = parseChordName(chordName);

  // perfect 4th = +5 semitones
  const subdominantRoot = transposePerfectInterval(root, 5);

  // perfect 5th = +7 semitones
  const dominantRoot = transposePerfectInterval(root, 7);

  const qualitySuffix = quality === "min" ? "m" : ""; // "C", "Am", etc.

  return {
    tonic: `${root}${qualitySuffix}`,
    subdominant: `${subdominantRoot}${qualitySuffix}`,
    dominant: `${dominantRoot}${qualitySuffix}`,
  };
};
