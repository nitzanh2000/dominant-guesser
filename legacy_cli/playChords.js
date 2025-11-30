// playChords.js
// Reusable MIDI chord player module using easymidi

import easymidi from "easymidi";

// ----------------------
// Helpers
// ----------------------

const NOTE_NAMES = [
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

function noteToMidi(note) {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) throw new Error(`Invalid note: ${note}`);

  const [, name, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  const noteIndex = NOTE_NAMES.indexOf(name);

  if (noteIndex === -1) {
    throw new Error(`Unknown note name: ${name}`);
  }

  return noteIndex + (octave + 1) * 12;
}

// ----------------------
// Public API
// ----------------------

/**
 * Return an array of available MIDI output names.
 */
export function listMidiOutputs() {
  return easymidi.getOutputs();
}

/**
 * Create and return an easymidi.Output instance.
 * If outputName is not provided, uses the first available output.
 */
export function createMidiOutput(outputName) {
  const outputs = easymidi.getOutputs();

  if (!outputs.length) {
    throw new Error(
      "No MIDI outputs found. Open a DAW/synth or IAC Driver first."
    );
  }

  const nameToUse = outputName || outputs[0];

  if (!outputs.includes(nameToUse)) {
    throw new Error(
      `MIDI output "${nameToUse}" not found. Available outputs: ${outputs.join(
        ", "
      )}`
    );
  }

  return new easymidi.Output(nameToUse);
}

/**
 * Play a single chord on a given MIDI output.
 *
 * @param {easymidi.Output} output - MIDI output object from createMidiOutput
 * @param {{ name?: string, notes: string[] }} chord - chord definition
 * @param {Object} options
 * @param {number} [options.durationMs=1000] - chord duration in ms
 * @param {number} [options.channel=0] - MIDI channel (0–15)
 * @param {number} [options.velocity=100] - velocity (0–127)
 * @returns {Promise<void>}
 */
export function playChord(output, chord, options = {}) {
  const { durationMs = 1000, channel = 0, velocity = 100 } = options;

  if (!output) throw new Error("playChord: output is required");
  if (!chord || !Array.isArray(chord.notes)) {
    throw new Error("playChord: chord must have a 'notes' array");
  }

  const midiNotes = chord.notes.map(noteToMidi);

  //console.log("Playing chord:", chord.name || chord.notes.join(", "));

  // Note on
  midiNotes.forEach((note) => {
    output.send("noteon", { note, velocity, channel });
  });

  // Schedule note off
  return new Promise((resolve) => {
    setTimeout(() => {
      midiNotes.forEach((note) => {
        output.send("noteoff", { note, velocity: 0, channel });
      });
      resolve();
    }, durationMs);
  });
}

/**
 * Play an array of chords in sequence.
 *
 * @param {easymidi.Output} output
 * @param {Array<{ name?: string, notes: string[] }>} chords
 * @param {Object} options
 * @param {number} [options.durationMs=1000] - per-chord duration
 * @param {number} [options.gapMs=200] - gap between chords
 * @param {number} [options.channel=0]
 * @param {number} [options.velocity=100]
 * @returns {Promise<void>}
 */
export async function playChordSequence(output, chords, options = {}) {
  const {
    durationMs = 1000,
    gapMs = 200,
    channel = 0,
    velocity = 100,
  } = options;

  if (!Array.isArray(chords) || !chords.length) {
    throw new Error("playChordSequence: chords must be a non-empty array");
  }

  for (const chord of chords) {
    await playChord(output, chord, { durationMs, channel, velocity });
    await new Promise((res) => setTimeout(res, gapMs));
  }
}

/**
 * Safely close a MIDI output.
 */
export function closeMidiOutput(output) {
  if (output && typeof output.close === "function") {
    output.close();
  }
}
