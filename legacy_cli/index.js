// main.js
import {
  listMidiOutputs,
  createMidiOutput,
  playChordSequence,
  closeMidiOutput,
} from "./playChords.js";
import { getDominantAndSubdominant, getRandomScale } from "./utils.js";
import { chordToNotes } from "./chordToNotes.js";

function randomArray(func, length) {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(func());
  }
  return result;
}

const main = async () => {
  const outputs = listMidiOutputs();
  console.log("Available MIDI outputs:", outputs);
  const output = createMidiOutput();

  const scale = getRandomScale();
  const chordNames = getDominantAndSubdominant(scale);

  const creataChord = (chordName, place) => ({
    ...chordToNotes(chordName),
    place,
  });

  const getRandomProperty = (obj) => {
    const keys = Object.keys(obj);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return [obj[key], key];
  };

  try {
    console.log(`
=================================================


                Playing tonic:


=================================================
        


        `);
    const tonic = creataChord(...getRandomProperty(chordNames));

    await playChordSequence(output, [tonic], {
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

    const chords = randomArray(
      () => creataChord(...getRandomProperty(chordNames)),
      4
    );

    await playChordSequence(output, chords, {
      durationMs: 4000,
      gapMs: 200,
      channel: 0,
      velocity: 100,
    });

    const PLACES = { tonic: 1, subdominant: 4, dominant: 5 };

    console.log(`The result are: ${chords.map(
      ({ place }) => `${PLACES[place]}`
    )}

The scale was: ${scale}
And the chords: 
,${chords.map(
      ({ name, notes }) => `${name}:  ${notes}
`
    )}
`);
  } finally {
    closeMidiOutput(output);
  }
};

main().catch(console.error);
