

var ChordialJS = ChordialJS || {};
if (typeof console === "undefined") {
	/*jslint browser: true */
	window.console = { log : function(){} };
}

ChordialJS.chordcalc = {
   //A note can be represented as an integer from C0=0,C1=12,...
	//UNTESTED
   calcFrettedNote: function(openNote, fret, openOctave) {
      var notes= ChordialJS.getAllNotesFromRoot(openNote);
      var semitone= fret % 12;
      var frettedNote= notes[semitone];
      return frettedNote;
   },

   getNumericNote : function(textualNote) {
      var notes= ChordialJS.data.notes;
      var index=-1;
      for(var i=0; i<notes.length; i++) {
         if(notes[i]===textualNote) {
            index=i;
         }
      }
      return index;
   },

	//UNTESTED
   getAlphaNote : function(numericNote) {
      var notes= ChordialJS.data.notes;
      var i= numericNote % 12;
      return notes[i];
   },

	// C0 -> [C,0]
   splitScientificNotation : function (sciNote) {
      var patt= /^([A-G][#b]?)([0-9])$/;
      var matches;
      if(matches= sciNote.match(patt)) {
	var ret= [matches[1], parseInt(matches[2], 10)];
	//console.log("Note: "+sciNote+" . split: " + ret);
	return ret;
      } else {
	//error
	console.log("NO match for input " + sciNote);
      }
   },

	// C0 -> 0. C1 -> 12.
   parseScientificNotation : function(sciNote) {
      var parts;
      if(parts= this.splitScientificNotation(sciNote)) {
         //console.log(parts);
         var noteComponent= ChordialJS.normaliseNote(parts[0]);
         var octave= parseInt(parts[1],10);
         var octaveInt= parseInt(octave,10);
         var index= this.getNumericNote(noteComponent);
        // console.log("octave: "+octaveInt+", note: "+index);
         if(index>-1) {
            return octaveInt*12 + index;
         } else {
            //ERROR!
         }
      }
   },

   parseScientificNotes : function (sciNotes) {
      var openNotes=[];
      for(var i=0; i<sciNotes.length;i++) {
         openNotes[i]= this.parseScientificNotation(sciNotes[i]);
      }
      return openNotes;
   },

   tunings : {
      standard : ["E2","A2","D3","G3","B3","E4"],
      ukulele : ["G4","C4","E4","A4"]
   },

   getSemitones : function(family) {
      var semis=[];
      if(family==='major') {
         semis= [0,4,7];
      } else if(family==='minor') {
         semis= [0,3,7];
      }
      return semis;
   },

   buildChord: function(tuning, root, family) {
      //console.log("build chord: "+tuning);
      var notes0to11= ChordialJS.getAllNotesFromRoot(root);
      var numericOpenNotes= this.parseScientificNotes(tuning);
         var semis= this.getSemitones(family);
         //for(var i=0;i<semis.length;i++) {
         //   console.log("note "+i+"="+notes0to11[semis[i]]);
         //}
         var positions= this.populateUpToRoot(numericOpenNotes, root, semis);
         positions= this.populateRemainingStrings(numericOpenNotes, root, semis, positions);

      return positions;
   },

   populateRemainingStrings : function(openNotes, root,semis,positions) {
      var rootInt= this.getNumericNote(root);
      for(var r=positions.length; r<openNotes.length;r++) {
         //for each semi, find the closest to open.
         var fret=null;
         for(var s=0;s<semis.length;s++) {
            var noteOfOpen = openNotes[r] % 12;
            var lookedForNote= (semis[s]+rootInt) % 12;
            //console.log("open: "+noteOfOpen+", lfn:"+lookedForNote);
            var pos;
            if(noteOfOpen > lookedForNote) {
               pos= lookedForNote-noteOfOpen+12;
            } else {
               pos= lookedForNote-noteOfOpen;
            }
            if(fret==null) {
               fret=pos;
            } else if(fret>pos) {
               fret=pos;
            }
         }
         positions[r]=fret;
      }
      return positions;
   },

   populateUpToRoot : function(openNotes, root,semis) {
      var rootInt= this.getNumericNote(root);
      var positions=[];
      var currentSemi=0;
      for(var r=0; r<openNotes.length;r++) {
         var noteOfOpen = openNotes[r] % 12;
         var lookedForNote= semis[currentSemi]+rootInt;
         var pos;
         if(noteOfOpen > lookedForNote) {
            pos= lookedForNote-noteOfOpen+12;
         } else {
            pos= lookedForNote-noteOfOpen;
         }
         //try next string?
         if(openNotes.length>r) {
            var fretsToNextString= openNotes[r+1] - openNotes[r];
            if(pos >= fretsToNextString) {
               positions[r]= 'X';
               continue;
            }
         }
         positions[r]= pos;
         break;
      }
      return positions;
   },

//opposite direction - calc notes from a chord.
   calculateNotesOfChord : function(positions, tuning, lefty) {
      var notes=[];
      //slice(0) returns a copy of the array, so the source array isn't affected by any reversing.
      var rootNotes= ChordialJS.data.tunings[tuning].slice(0);
      if (lefty === true) {
        rootNotes= rootNotes.reverse();
      }
      //console.log(rootNotes);
      for(var i=0; i < positions.length; i++) {
	var splittedRootNote= this.splitScientificNotation(rootNotes[i]);
	notes[i]= this.calcFrettedNote(splittedRootNote[0], positions[i]);
      }
      return notes;
   }

};
