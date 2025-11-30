import * as Tone from 'tone';

let synth = null;

export const initAudio = async () => {
  await Tone.start();
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.volume.value = -10; // Lower volume a bit
  }
};

export const playChord = (notes, duration = 4) => {
  if (!synth) return;
  // Tone.js accepts notes like "C4", "E4", "G4"
  // duration can be '1n' (whole note), '2n' (half), '4n' (quarter), etc.
  // or seconds.
  synth.triggerAttackRelease(notes, duration);
};

export const playSequence = async (chords, durationPerChord = 4, gap = 0.2) => {
  if (!synth) await initAudio();
  
  const now = Tone.now();
  
  chords.forEach((chord, index) => {
    const time = now + index * (durationPerChord + gap);
    synth.triggerAttackRelease(chord.notes, durationPerChord, time);
  });
  
  // Return promise that resolves when sequence finishes
  return new Promise(resolve => {
    setTimeout(resolve, (chords.length * (durationPerChord + gap)) * 1000);
  });
};
