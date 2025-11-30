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
export function chordToNotes(chordName, octave = 4) {
  const { root, type } = parseChordName(chordName);

  const intervals = CHORD_INTERVALS[type];
  if (!intervals) throw new Error(`Intervals missing for chord type: ${type}`);

  const notes = intervals.map(
    (st) => `${transpose(root, st)}${randomOctave()}`
  );

  return {
    name: chordName,
    notes,
  };
}
