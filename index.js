// main.js
import {
  listMidiOutputs,
  createMidiOutput,
  playChordSequence,
  closeMidiOutput,
} from "./playChords.js";
import { getDominantAndSubdominant, getRandomScale } from "./utils.js";
import { chordToNotes } from "./chordToNotes.js";

function randomArray(list, length) {
  const result = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * list.length);
    result.push(list[randomIndex]);
  }
  return result;
}

const main = async () => {
  const outputs = listMidiOutputs();
  console.log("Available MIDI outputs:", outputs);
  const output = createMidiOutput();

  const scale = getRandomScale();
  const chordNames = getDominantAndSubdominant(scale);

  const tonicNotes = { ...chordToNotes(chordNames.tonic), place: "1" };
  const subdominantNotes = {
    ...chordToNotes(chordNames.subdominant),
    place: "4",
  };
  const dominantNotes = {
    ...chordToNotes(chordNames.dominant),
    place: "5",
  };

  try {
    console.log(`
=================================================


                Playing tonic:


=================================================
        


        `);

    await playChordSequence(output, [tonicNotes], {
      durationMs: 7000,
      gapMs: 200,
      channel: 0,
      velocity: 100,
    });

    console.log(`
=================================================


                    Test:


=================================================
        
        `);

    await new Promise((res) => setTimeout(res, 1000));

    // 3. Define chords however you like
    const chords = randomArray(
      [tonicNotes, subdominantNotes, dominantNotes],
      4
    );

    await playChordSequence(output, chords, {
      durationMs: 4000,
      gapMs: 200,
      channel: 0,
      velocity: 100,
    });

    console.log(`The result are: ${chords.map(({ place }) => `${place}`)}

The scale was: ${scale}
And the chords: 
${chords.map(({ name }) => `${name}`)}`);
  } finally {
    closeMidiOutput(output);
  }
};

main().catch(console.error);
