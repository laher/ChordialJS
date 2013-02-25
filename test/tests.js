test( "Parse scientific notation", function() {
    ok(0 === ChordialJS.chordcalc.parseScientificNotation("C0"), "C0");
    ok(14 === ChordialJS.chordcalc.parseScientificNotation("D1"), "D1");
    ok(10 === ChordialJS.chordcalc.parseScientificNotation("Bb0"), "Bb");
    /// ok( 1 == "1", "Passed!" );
/*
});


test( "Calculate fretted note", function() {

   expect(0);
   });

test( "Build chord", function() {
 */
    var openNotes= ChordialJS.chordcalc.parseScientificNotes(
            ChordialJS.chordcalc.tunings.standard);

   var semis= ChordialJS.chordcalc.getSemitones("major");
   var positions= ChordialJS.chordcalc.populateUpToRoot(openNotes,"C",semis);
   //console.log(positions);
   ok("X" === positions[0] && 3 === positions[1], "C root note" );

   for(var i=0; i<ChordialJS.data.notes.length; i++) {
    var note = ChordialJS.data.notes[i];
    positions= ChordialJS.chordcalc.buildChord(ChordialJS.chordcalc.tunings.standard,note,"major");
   //console.log(note+" major: " + positions);
    positions= ChordialJS.chordcalc.buildChord(ChordialJS.chordcalc.tunings.standard,note,"minor");
   //console.log(note+" minor: " + positions);
   }
    positions= ChordialJS.chordcalc.buildChord(ChordialJS.chordcalc.tunings.standard,"D","major");
   //console.log(positions);
    positions= ChordialJS.chordcalc.buildChord(ChordialJS.chordcalc.tunings.standard,"G","major");
   //console.log(positions);
    positions= ChordialJS.chordcalc.buildChord(ChordialJS.chordcalc.tunings.standard,"E","minor");
   //console.log(positions);
    positions= ChordialJS.chordcalc.buildChord(ChordialJS.chordcalc.tunings.standard,"E","major");
   //console.log(positions);
   ok(   0 === positions[0] &&
         2 === positions[1] &&
         2 === positions[2] &&
         1 === positions[3] &&
         0 === positions[4] &&
         0 === positions[5]

         , "E Major" );
    positions= ChordialJS.chordcalc.buildChord(ChordialJS.chordcalc.tunings.standard,"F","major");
   //console.log(positions);
   });


test( "Get/calc chords", function() {
   var chord= { note: 'E', tuning : 'standard', fingering : 'open', family : 'major', size : 1 };
   var ret= ChordialJS.getPositionsAndFingers(chord);
   equal( ret.positions, "022100", "E major fingerings" );
   chord= { note: 'A', tuning : 'standard', fingering : 'barre:E-shape', family: 'major', size : 1 };
   ret= ChordialJS.getPositionsAndFingers(chord);
   equal( ret.positions, "577655", "A major barre:E-shape fingerings" );
   chord= { note: 'D', tuning : 'standard', fingering : 'barre:A-shape', family: 'major', size : 1 };
   ret= ChordialJS.getPositionsAndFingers(chord);
   equal( ret.positions, "X57775", "D major barre:A-shape fingerings" );
   });

test( "calc notes", function() {
	var posEMaj= [0,2,2,1,0,0];
	var notes= ChordialJS.chordcalc.calculateNotesOfChord(posEMaj, 'standard', false);
	deepEqual(notes, ["E","B","E","G#","B","E"], "calculated notes for open E major");
	var posAMaj= ['X',0,2,2,2,0];
	notes= ChordialJS.chordcalc.calculateNotesOfChord(posAMaj, 'standard', false);
	deepEqual(notes, [undefined,"A","E","A","C#","E"], "calculated notes for open A major");
   });
