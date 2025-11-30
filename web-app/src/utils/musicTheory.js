// Chromatic scale with sharps
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Mapping flats → sharps
const FLATS = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

// Intervals in semitones
const CHORD_INTERVALS = {
  maj: [0, 4, 7], // major triad
  min: [0, 3, 7], // minor triad
  7: [0, 4, 7, 10], // dominant 7
  maj7: [0, 4, 7, 11], // major 7
  min7: [0, 3, 7, 10], // minor 7
};

// Normalize flats to sharps
function normalize(note) {
  return FLATS[note] || note;
}

// Extract root + type
function parseChordName(chordName) {
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);
  if (!match) throw new Error(`Invalid chord: ${chordName}`);

  let [, root, type] = match;

  root = normalize(root);

  type = type.toLowerCase();

  // Interpret chord types
  if (type === "" || type === "maj") return { root, type: "maj" };
  if (type === "m" || type === "min") return { root, type: "min" };
  if (type === "7") return { root, type: "7" };
  if (type === "maj7") return { root, type: "maj7" };
  if (type === "m7" || type === "min7") return { root, type: "min7" };

  throw new Error(`Unsupported chord type: ${chordName}`);
}

// Transpose root by semitones
function transpose(root, semitones) {
  const i = NOTES.indexOf(root);
  if (i === -1) throw new Error(`Unknown root note: ${root}`);
  return NOTES[(i + semitones + 12) % 12];
}

const randomOctave = () => Math.floor(Math.random() * 3) + 3;

// Convert chord name into list of note names
export function chordToNotes(chordName, level = 1) {
  const { root, type } = parseChordName(chordName);

  const intervals = CHORD_INTERVALS[type];
  if (!intervals) throw new Error(`Intervals missing for chord type: ${type}`);

  const generateNotesByLevel = (level) => {
    const DEFULT_OCTIVE = 4;
    switch (level) {
      case 1:
        return intervals.map((st) => `${transpose(root, st)}${DEFULT_OCTIVE}`);
      case 2:
        const octive = randomOctave();
        return intervals.map((st) => `${transpose(root, st)}${octive}`);
      case 3:
        return intervals.map((st) => `${transpose(root, st)}${randomOctave()}`);
      default:
        return intervals.map((st) => `${transpose(root, st)}${DEFULT_OCTIVE}`);
    }
  };

  const notes = generateNotesByLevel(level);

  return {
    name: chordName,
    notes,
  };
}

export const getRandomScale = () => {
  const chordName = NOTES[Math.floor(Math.random() * NOTES.length)];
  return chordName;
};

export const getDominantAndSubdominant = (chordName) => {
  const { root, type } = parseChordName(chordName);
  
  // We assume the input is a major key tonic for now, or just use the root
  // perfect 4th = +5 semitones
  const subdominantRoot = transpose(root, 5);

  // perfect 5th = +7 semitones
  const dominantRoot = transpose(root, 7);

  // In a major key:
  // Tonic = Major
  // Subdominant = Major
  // Dominant = Major (or Dominant 7th often used, but let's stick to triads or what the old code did)
  
  // The old code preserved quality? 
  // "const qualitySuffix = quality === "min" ? "m" : "";"
  // Let's check the old utils.js again.
  // It inferred quality from the input chord.
  // If input is "C", quality is maj. Subdominant "F", Dominant "G".
  // If input is "Cm", quality is min. Subdominant "Fm", Dominant "Gm".
  
  const qualitySuffix = type === "min" ? "m" : ""; 

  return {
    tonic: `${root}${qualitySuffix}`,
    subdominant: `${subdominantRoot}${qualitySuffix}`,
    dominant: `${dominantRoot}${qualitySuffix}`,
  };
};
