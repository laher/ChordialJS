
/**
 * ChordialJS
 * ==========
 *
 * Data and progression-building code
 * ----------------------------------
 * Progression-building code is mine, built on top of ChordJS, as mentioned below.
 * Chord and musical data has been gathered from wikipedia and my own learning. No guarantees for correctness or completion. IANAM (I am not a musician!)
 *
 * ChordialJS
 * https://github.com/laher/ChordialJS
 * Copyright (C) 2012 Am Laher [am@laher.net.nz]
 *
 * Drawing code
 * ------------
 * Drawing and parsing code originally form ChordJS, but it's been a bit rewritten for speed & efficiency.
 *
 * ChordialJS
 * https://github.com/laher/ChordialJS
 * Copyright (C) 2012 Am Laher [am@laher.net.nz]
 *
 * Based on:
 *  ChordJS
 *  https://github.com/acspike/ChordJS
 *  Copyright (C) 2012 Aaron Spike [aaron@ekips.org]
 *
 *  Based On:
 *   Chord Image Generator
 *   http://einaregilsson.com/2009/07/23/chord-image-generator/
 *   Copyright (C) 2009-2012 Einar Egilsson [einar@einaregilsson.com]
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var ChordialJS = {

   //turn a flat into a sharp for look-ups
   normaliseNote : function(note) {
        if(note.length > 1 && note.charAt(1)==='b') {
                if(note.charAt(0)==='A') {
                        return 'G#';
                }else if(note.charAt(0)==='C') {
                        return 'B';
                } else if(note.charAt(0)==='F') {
                        return 'E';
                } else {
                        return String.fromCharCode(note.charCodeAt(0) - 1) + "#";
                }
        } else if(note.length > 1 && note.charAt(1)==='#') {
                if(note.charAt(0)==='B') {
                   return 'C';
                } else if(note.charAt(0)==='E') {
                   return 'F';
                } else {
                   return note;
                }
        } else {
                return note;
        }
   },
   reverseString : function(input) {
        return input.split("").reverse().join("");
   },

   getExistingCharts : function(container) {
      var children = container.childNodes;
      var charts= [];
      for(var j=0;j<children.length;j++) {
            if(children[j].nodeType===1) {
               //Container?
               if(children[j].className==='ChordialChordContainer') {
                  charts.push(children[j]);
               }
            }
      }
      return charts;
   },

   makeChord : function(parentElement,definition, existingChart) { //name family and options are optional
      var chord= this.cleanInput(definition);
      var container;
      if(existingChart) {
         container= existingChart;
      } else {
         container= this.makeChordContainer(chord);
         parentElement.appendChild(container);
      }
      this.updateChordContainer(chord,container);
      return container;
   },

   cleanInput : function(definition) { //see optional elements
      //clean input
      if(definition.family === undefined) { definition.family='major'; }
      if(definition.fingering === undefined) { definition.fingering='open'; }
      if(definition.size === undefined) { definition.size=3; }
      if(definition.tuning === undefined) { definition.tuning = 'standard'; }
      if(definition.name === undefined) { definition.name = definition.note +
         (ChordialJS.data.chordTypes.abbreviations[definition.family] !== undefined ?
         ChordialJS.data.chordTypes.abbreviations[definition.family][0] : definition.family);
      }
      if(definition.lefty === undefined) { definition.lefty = false; }
      return definition;
   },

   makeChordContainer : function(chord) {
   //make a container div
        var holder= document.createElement('div');
        holder.className = 'ChordialChordContainer';
        holder.style['cssFloat']= 'left';
        var nameDiv= this.makeNameDiv(chord,holder);
        holder.appendChild(nameDiv);
        var cdiv= this.makeCanvasDiv();
        holder.appendChild(cdiv);
        return holder;
   },

   makeCanvasDiv : function() {
        var holder= document.createElement('div');
        holder.className = 'ChordialCanvasDiv';
        holder.style['position']= 'relative';
        return holder;
   },

   makeNameDiv : function(chord,holder) {
    var inner= document.createElement('div');
    inner.className="ChordialNameDiv";
    inner.style['text-align']='center';
    inner.style.width='100%';
    inner.style.padding="0px";
    inner.style.margin="0px";
    var mainSpan= document.createElement('span');
    var superSpan= document.createElement('sup');
    inner.appendChild(mainSpan);
    inner.appendChild(superSpan);
    return inner;
   },

   updateNameDiv : function(chord,holder) {
      var nameAndSuper= ChordialJS.splitNameAndSuper(chord.name);
      for(var i=0; i<holder.childNodes.length;i++) {
         var ch= holder.childNodes[i];
         if(ch.nodeType === 1) {
            if(ch.nodeName === 'SPAN') {
               if(ch.firstChild!==null) {
                  ch.removeChild(ch.firstChild);
               }
               ch.appendChild(document.createTextNode(nameAndSuper[0]));
            } else if(ch.nodeName === 'SUP') {
               if(ch.firstChild!==null) {
                  ch.removeChild(ch.firstChild);
               }
               ch.appendChild(document.createTextNode(nameAndSuper[1] + "\u00a0"));
            }
         }
      }
   },

   getFirstChildTagClass : function(element,tagname,classname) {
      var children= element.childNodes;
      for (var j = 0; j < children.length; j++) {
         if(children[j].nodeType===1) {
            if(children[j].nodeName===tagname) {
               if(children[j].className===classname) {
                  return children[j];
               }
            }
         }
      }
   },

   calcMovableChord : function(chord) {
      var ret= {};
      var notes0to11,base;
      if(chord.tuning==="standard") {
         if(chord.fingering === "barre:E-shape") {
            notes0to11= ChordialJS.getAllNotesFromRoot("E");
            base= notes0to11.indexOf(chord.note);
            ret.positions= [base,base+2,base+2,base+1,base,base].join("");
            ret.fingers= "134211";
         }else if(chord.fingering === "barre:A-shape") {
            notes0to11= ChordialJS.getAllNotesFromRoot("A");
            base= notes0to11.indexOf(chord.note);
            ret.positions= ['X',base,base+2,base+2,base+2,base].join("");
            ret.fingers= "-13331";
         }
      }
      return ret;
   },


   getPositionsAndFingers : function(chord) {
      //look in preferred chord data
      var tuningArr=  ChordialJS.data.chords[chord.tuning];
      var ret={};
      //positions,fingers;
      if(tuningArr) {
         var familyArr= tuningArr[chord.family];
         if(familyArr) {
            var noteObj= familyArr[this.normaliseNote(chord.note)];
            if(noteObj) {
               var fingeringArr= noteObj[chord.fingering];
               if(fingeringArr) {
                  ret.positions= fingeringArr[0];
                  ret.fingers= fingeringArr[1];
               }
            }
         }
      }
      if(ret.positions === undefined) {
         if(chord.fingering.indexOf("barre:") === 0) {
            ret= this.calcMovableChord(chord);
         } else {
            //calculate chord!
            ret.positions= this.chordcalc.buildChord(
               this.chordcalc.tunings.standard,chord.note,chord.family)
                  .join("");
         }
      }
      if(chord.lefty) {
         ret.positions= this.reverseString(ret.positions);
         ret.fingers= this.reverseString(ret.fingers);
      }
      return ret;
      //{ positions: positions,fingers: fingers};
   },

   updateChordContainer : function(chord,holder) {
      holder.setAttribute('data-name',chord.name);
   //look up positions & fingers
      var ret= this.getPositionsAndFingers(chord);
   //set attributes
        holder.setAttribute('data-positions', ret.positions);
        holder.setAttribute('data-fingers', ret.fingers);
        holder.setAttribute('data-size', chord.size);
        holder.setAttribute('data-tuning', chord.tuning);
        holder.setAttribute('data-lefty', chord.lefty);
        for(var i=0; i<holder.childNodes.length;i++) {
            var ch= holder.childNodes[i];
            if(ch.nodeType=== 1) {
               if (ch.nodeName==='DIV') {
                  this.updateNameDiv(chord,ch);
               }
            }

        }
        //holder.appendChild(document.createTextNode(chord.name));
        return holder;
   },

   splitNameAndSuper : function(name_plain) {
      var name;
      var supers;
      if (name_plain.indexOf('_') === -1) {
          name = name_plain;
          supers = "";
      } else {
          var parts = name_plain.split('_');
          name = parts[0];
          supers = parts[1];
      }
      return [name, supers];
   },

   normaliseFamily : function(family_given) {
      for (var family_name in ChordialJS.data.chordTypes.abbreviations) {
         if (family_given === family_name) {
            return family_name;
         }
         var abbr= ChordialJS.data.chordTypes.abbreviations[family_name];
         for(var i=0; i<abbr.length;i++) {
            if(family_given === abbr[i]) {
               return family_name;
            }
         }
      }
      //unknown. Return input
      return family_given;
   },


   parseChordName : function(input, defaults) {
      var pattern= /^([A-Ga-g][b#]?)_?([7|maj7|maj|min7|min|sus2|m|sus4|o|dim])?$/;
      if(input.match(pattern)) {
         //TODO: split into note + family.
         var arr= input.match(pattern);
         var family = this.normaliseFamily(arr[2]);
         return this.mergeDefaults({ note: arr[1].toUpperCase(), family : family }, defaults);
      }
   },
   parseProgression : function(input,defaults) {
      var progression= [];
      var lines = input.split(/\r?\n/);
      for(var i=0;i<lines.length;i++) {
         var notes= lines[i].trim().split(/\s+/);
         for(var ni=0;ni<notes.length;ni++) {
            //is it a note?
            var definition= this.parseChordName(notes[ni],defaults);
            if(definition) {
               progression.push(
                     this.cleanInput(definition));
            }
         }
      }
      return progression;
   },

   makeNamedProgression : function(scaleType, root, progression, defaults) {
      return this.makePartialProgression(scaleType,root,
            ChordialJS.data.progressions.heptatonic[progression], defaults);
   },
   makePartialProgression : function(scaleType, root, definitions, defaults) {
      var fullProgression= this.makeProgression(scaleType, root);
      var partialProgression=[];
      for(var i=0; i<definitions.length; i++) {
         var definition= this.mergeDefaults(definitions[i], defaults);
         var degree= definition.degree;
         var note= fullProgression[degree-1].note;
         var chordFamily= definition.family || fullProgression[degree-1].family;
         definition= this.mergeDefaults(definition, {
            note: note,
            family: chordFamily
         });
         partialProgression.push(definition);
      }
      return partialProgression;
   },

   makeProgression : function(scaleType, root) {
      var scale= this.makeScale(scaleType,root);
      var progression=[];
      var chordtypes= ChordialJS.data.scales.chordtypes[scaleType];
      for(var i=0;i<scale.length;i++) {

         progression.push({note: scale[i], family: chordtypes[i]});
      }
      return progression;
   },

   makeScale : function(scaleType,root) {
        var allNotes= this.getAllNotesFromRoot(root);
        var degrees= ChordialJS.data.scales.degrees[scaleType];
        var scale=[];
        //scale.push(root);
        var noteIndex=0;
        for(var i=0;i<degrees.length;i++) {
                noteIndex=degrees[i]-1;
                scale.push(allNotes[noteIndex]);
        }
        return scale;
   },

   getAllNotesFromRoot : function(root) {
        var allNotes=[];
        var endNotes=[];
        var foundRoot=false;
        for(var i=0; i<ChordialJS.data.notes.length;i++) {
                if(root === ChordialJS.data.notes[i]) {
                        foundRoot=true;
                }
                if(foundRoot) {
                        allNotes.push(ChordialJS.data.notes[i]);
                } else {
                        endNotes.push(ChordialJS.data.notes[i]);
                }
        }
        return allNotes.concat(endNotes);
   },

   mergeDefaults : function(object1,defaults) {
      var merged= {};
      for (var prop in object1) {
         merged[prop] = object1[prop];
      }
      for (var dprop in defaults) {
         if (dprop in merged) { continue; }
         merged[dprop] = defaults[dprop];
      }
      return merged;
   },

   renderChords : function(parentElement, definitions, defaults) {
      var existingCharts= this.getExistingCharts(parentElement);
      defaults = defaults || {};
      for(var i=0; i<definitions.length; i++) {
         var container;
         var definition= this.mergeDefaults(definitions[i], defaults[i]);
         if(existingCharts.length>i) {
            container= this.makeChord(parentElement, definitions[i], existingCharts[i]);
         } else {
            container= this.makeChord(parentElement, definitions[i]);
         }
        this.render.renderElement(container);
      }
      // remove extra chords
      for(var j=existingCharts.length-1; j>definitions.length-1; j--) {
         parentElement.removeChild(existingCharts[j]);
      }
   },

   /* definition: { name, note, family, size, tuning, ... }
    *
    */
   renderChord : function(parentElement, definition, existingChartElement) {
        var container= this.makeChord(parentElement, definition, existingChartElement);
        this.render.renderElement(container);
   }
};





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

/**
 * ChordialJS
 * ==========
 *
 * Data and progression-building code
 * ----------------------------------
 * Progression-building code is mine, built on top of ChordJS, as mentioned below.
 * Chord and musical data has been gathered from wikipedia and my own learning. No guarantees for correctness or completion. IANAM (I am not a musician!)
 *
 * ChordialJS
 * https://github.com/laher/ChordialJS
 * Copyright (C) 2012 Am Laher [am@laher.net.nz]
 *
 * Drawing code
 * ------------
 * Drawing and parsing code originally form ChordJS, but it's been a bit rewritten for speed & efficiency.
 *
 * ChordialJS
 * https://github.com/laher/ChordialJS
 * Copyright (C) 2012 Am Laher [am@laher.net.nz]
 *
 * Based on:
 *  ChordJS
 *  https://github.com/acspike/ChordJS
 *  Copyright (C) 2012 Aaron Spike [aaron@ekips.org]
 *
 *  Based On:
 *   Chord Image Generator
 *   http://einaregilsson.com/2009/07/23/chord-image-generator/
 *   Copyright (C) 2009-2012 Einar Egilsson [einar@einaregilsson.com]
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var ChordialJS = ChordialJS || {};
if (typeof console === "undefined") {
	/*jslint browser: true */
	window.console = { log : function(){} };
}
ChordialJS.parse = {
   parsePositions : function(positions) {
     if (positions === null ||
                typeof positions === 'undefined' ||
                (!positions.match(/[\dxXA-Fa-f]{6}|((1|2)?[\dxX]-){5}(1|2)?[\dxX]/) &&
                !positions.match(/[\dxXA-Fa-f]{4}|((1|2)?[\dxX]-){3}(1|2)?[\dxX]/))
                ) {
        console.log("Error of chord pos: "+positions);
        return { error : true };
    } else {
        var parts;
        //TODO - change to 'contains dashes'
        if (positions.length > 6) {
            parts = positions.split('-');
        } else {
            parts = positions.split('');
        }
        var ret= {
                error : false,
                chordPositions : [],
                maxFret : 0,
                minFret : 99 //big-enough number
        };
        for (var i = 0; i < positions.length; i++) {
            if (parts[i].toUpperCase() === "X") {
                ret.chordPositions[i] = -1;
            } else {
                ret.chordPositions[i] = parseInt(parts[i],16);
                ret.maxFret = Math.max(ret.maxFret, ret.chordPositions[i]);
                if (ret.chordPositions[i] !== 0) {
                    ret.minFret = Math.min(ret.minFret, ret.chordPositions[i]);
                }
            }
        }
        if (ret.maxFret <= 5) {
            ret.baseFret = 1;
        } else {
            ret.baseFret = ret.minFret;
        }
        return ret;
    }
   },

   parseFingers : function(fingers) {
      fingers = String(fingers).toUpperCase();
      fingers = fingers.replace(/[^\-T1234]/g,'');
      var fingersArray = fingers.split('');
      return fingersArray;
   },

   fillStyleDefaults : function(style) {
        style = typeof style !== 'undefined' ? style : { 'background-color' : '#fff' };
        style['color'] = style['color'] ? style['color'] : '#000';
        style['font-family'] = style['font-family'] ? style['font-family'] : 'Arial';
        return style;
   },

   parseSizes : function(size, stringCount) {
        //ukes show 5 frets. Guitars 5.
        //var fretCount= stringCount > 4 ? stringCount-1 : stringCount;
        var fretCount= 5;
        var fretWidth= 4*size;
        var nutHeight = fretWidth / 2;
        var markerWidth = 0.7 * fretWidth;
        var lineWidth = Math.ceil(size * 0.31);
        var dotWidth = Math.ceil(0.9 * fretWidth);
        var perc = 4; //make it an int - easier on engine
        var fretFontSize = size * perc + 2;
        var fingerFontSize = size * perc + 2;
        var nameFontSize = size * 2 * perc;
        var superScriptFontSize = 0.7 * nameFontSize;
        if (size === 1) {
                nameFontSize += 2;
                fingerFontSize += 2;
                fretFontSize += 2;
                superScriptFontSize += 2;
        }

        var xstart = fretWidth;
        //removing font and superScript
        //var ystart = Math.round(0.2 * superScriptFontSize + nameFontSize + nutHeight + 1.7 * markerWidth);
        var ystart = Math.round(nutHeight + 1.7 * markerWidth);

        var boxWidth = (stringCount-1) * fretWidth + (stringCount) * lineWidth;
        var boxHeight = fretCount * (fretWidth + lineWidth) + lineWidth;
        var imageWidth = (boxWidth + 3 * fretWidth);
        var imageHeight = (boxHeight + ystart + fretWidth + fretWidth);

        var signWidth = (fretWidth * 0.75);
        var signRadius = signWidth / 2;
        return {
          fretWidth : fretWidth,
          nutHeight : nutHeight,
          lineWidth : lineWidth,
          dotWidth : dotWidth,
          markerWidth : markerWidth,
          boxWidth : boxWidth,
          boxHeight : boxHeight,
          stringCount : stringCount,
          fretCount : fretCount,
          nameFontSize : nameFontSize,
          fingerFontSize : fingerFontSize,
          fretFontSize : fretFontSize,
          superScriptFontSize : superScriptFontSize,
          xstart : fretWidth,
          ystart : ystart,
          imageWidth : imageWidth,
          imageHeight : imageHeight,
          signWidth : signWidth,
          signRadius : signRadius
        };
   },

   parse : function(chord) {
        chord.style= this.fillStyleDefaults(chord.style);
        var stringCount= chord.positions.length;
        return {
          sizes : this.parseSizes(chord.size, stringCount),
          positions : this.parsePositions(chord.positions),
          fingers : this.parseFingers(chord.fingers)
        };
   }
};

ChordialJS.render = {
   CLASS_CANVAS_BG : 'ChordialCanvasBg',
   CLASS_CANVAS_FG : 'ChordialCanvasFg',
   CLASS_CANVASDIV : 'ChordialCanvasDiv',
  drawName : function(ctx,chord) {
            var nameAndSuper= ChordialJS.splitNameAndSuper(chord.name);
            var name= nameAndSuper[0];
            var supers= nameAndSuper[1];
            ctx.fillStyle = chord.style.color;
            this.setFont(ctx,chord.parsed.sizes.nameFontSize,chord.style['font-family']);
            var stringSize = ctx.measureText(name);

            var xTextStart = chord.parsed.sizes.xstart;

            if (stringSize.width < chord.parsed.sizes.boxWidth) {
                xTextStart = chord.parsed.sizes.xstart + ((chord.parsed.sizes.boxWidth - stringSize.width) / 2);
            }
            ctx.fillText(name, xTextStart, 0.2 * chord.parsed.sizes.superScriptFontSize);
            if (supers !== "") {
                this.setFont(ctx,chord.parsed.sizes.superScriptFontSize,chord.parsed.sizes.style['font-family']);
                ctx.fillText(supers, xTextStart + 0.8 * stringSize.width, 0);
            }
   },

   drawBaseFret : function(ctx,chord) {
      var text;
      if (chord.parsed.positions.baseFret > 1) {
         text= chord.parsed.positions.baseFret + "";
      } else {
         text=" ";
      }
      this.setFont(ctx,chord.parsed.sizes.fretFontSize,chord.style['font-family']);
      var offset = (chord.parsed.sizes.fretFontSize - chord.parsed.sizes.fretWidth) / 2;
      ctx.fillText(text, chord.parsed.sizes.xstart + chord.parsed.sizes.boxWidth + 0.4 * chord.parsed.sizes.fretWidth, chord.parsed.sizes.ystart - offset);

      if(chord.parsed.positions.baseFret === 1)  {
            ctx.beginPath();
            ctx.rect(chord.parsed.sizes.xstart - (chord.parsed.sizes.lineWidth / 2),
                        chord.parsed.sizes.ystart - chord.parsed.sizes.nutHeight,
                        chord.parsed.sizes.boxWidth,
                        chord.parsed.sizes.nutHeight
                        );
         ctx.fill();
      }
   },

   setFont : function(ctx,size,fontFamily) {
        ctx.font = size+"px "+fontFamily;
        ctx.textBaseline = 'top';
   },

   drawBarres : function(ctx,chord) {
            var bars = {};
            var bar;
            for (var i = 0; i < (chord.parsed.sizes.stringCount-1); i++) {
                if (chord.parsed.positions.chordPositions[i] !== -1 && chord.parsed.positions.chordPositions[i] !== 0 && chord.parsed.fingers[i] !== '-' && !bars.hasOwnProperty(chord.parsed.fingers[i])) {
                    bar = { 'Str':i, 'Pos': chord.parsed.positions.chordPositions[i], 'Length':0, 'Finger':chord.parsed.fingers[i] };
                    for (var j = i + 1; j < chord.parsed.sizes.stringCount; j++) {
                        if (chord.parsed.fingers[j] === bar['Finger'] && chord.parsed.positions.chordPositions[j] === chord.parsed.positions.chordPositions[i]) {
                            bar['Length'] = j - i;
                        }
                    }
                    if (bar['Length'] > 0) {
                        bars[bar['Finger']] = bar;
                    }
                }
            }

            ctx.lineWidth= chord.parsed.sizes.lineWidth * 3;
            var totalFretWidth = chord.parsed.sizes.fretWidth + chord.parsed.sizes.lineWidth;
            ctx.beginPath();
            for (var b in bars) {
                //console.log(chord.name);
                //console.log(bars[b]);
                if (bars.hasOwnProperty(b)){
                    bar = bars[b];
                    var xstart = chord.parsed.sizes.xstart + bar['Str'] * totalFretWidth;
                    var xend = xstart + bar['Length'] * totalFretWidth;
                    var y = chord.parsed.sizes.ystart + (bar['Pos'] - chord.parsed.positions.baseFret + 1) * totalFretWidth - (totalFretWidth / 2);
                    //ctx.lineWidth= chord.parsed.sizes.lineWidth / 2;
                    ctx.moveTo(xstart, y);
                    ctx.lineTo(xend, y);
                }
            }
            ctx.stroke();
   },
   drawFingers : function(ctx,chord) {
        var xpos = chord.parsed.sizes.xstart + (0.5 * chord.parsed.sizes.lineWidth);
        var ypos = chord.parsed.sizes.ystart + chord.parsed.sizes.boxHeight;
        ctx.beginPath();
        this.setFont(ctx,chord.parsed.sizes.fingerFontSize,chord.style['font-family']);
	var charSize;
        for (var f=0; f<chord.parsed.fingers.length; f++) {
                var finger = chord.parsed.fingers[f];
                if (finger !== '-') {
                    charSize = ctx.measureText(finger.toString());
                    ctx.fillText(finger.toString(), xpos - (0.5 * charSize.width), ypos);
                }
                xpos += (chord.parsed.sizes.fretWidth + chord.parsed.sizes.lineWidth);
        }
        ctx.stroke();
	return charSize;
   },

   drawNotes : function(ctx, chord, fingerCharSize) {
        var xpos = chord.parsed.sizes.xstart + (0.5 * chord.parsed.sizes.lineWidth);
//        var ypos = chord.parsed.sizes.ystart + chord.parsed.sizes.boxHeight + 0;//fingerCharSize.height;
        var ypos = 0;
        ctx.beginPath();
        this.setFont(ctx,chord.parsed.sizes.fingerFontSize * 2/3,chord.style['font-family']);
	//console.log(chord);
	var notes= ChordialJS.chordcalc.calculateNotesOfChord(chord.parsed.positions.chordPositions, chord.tuning, chord.lefty);
	//console.log(notes);
	for (var i = 0; i < notes.length; i++) {
                var note = notes[i];
                if (note !== undefined) {
                    var charSize = ctx.measureText(note.toString());
                    ctx.fillText(note.toString(), xpos - (0.5 * charSize.width), ypos);
                }
                xpos += (chord.parsed.sizes.fretWidth + chord.parsed.sizes.lineWidth);
        }
        ctx.stroke();
   },

   drawPositions : function(ctx,chord) {
            var yoffset = chord.parsed.sizes.ystart - chord.parsed.sizes.fretWidth;
            var xoffset = chord.parsed.sizes.lineWidth / 2;
            var totalFretWidth = chord.parsed.sizes.fretWidth + chord.parsed.sizes.lineWidth;
            var xfirstString = chord.parsed.sizes.xstart + 0.5 * chord.parsed.sizes.lineWidth;

            ctx.beginPath();
            ctx.fillStyle = chord.style.color;
            ctx.strokeStyle= chord.style.color;
            ctx.lineWidth= chord.parsed.sizes.lineWidth;
            ctx.lineCap= 'round';
            var radius= chord.parsed.sizes.dotWidth/2;
            for (var i = 0; i < chord.parsed.positions.chordPositions.length; i++) {
                var absolutePos = chord.parsed.positions.chordPositions[i];
                var relativePos = absolutePos - chord.parsed.positions.baseFret + 1;
                var xpos = chord.parsed.sizes.xstart - (0.5 * chord.parsed.sizes.fretWidth) + (0.5 * chord.parsed.sizes.lineWidth) + (i * totalFretWidth);
                if (relativePos > 0) {
                    var ypos1 = relativePos * totalFretWidth + yoffset;
                    ctx.arc(xpos+radius, ypos1+radius, radius, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.beginPath();
                } else if (absolutePos === 0) {
                    var ypos2 = chord.parsed.sizes.ystart - chord.parsed.sizes.fretWidth;
                    var markerXpos1 = xpos + ((chord.parsed.sizes.dotWidth - chord.parsed.sizes.markerWidth) / 2);
                    if (chord.parsed.positions.baseFret === 1) {
                        ypos2 -= chord.nutHeight;
                    }
                    ctx.arc(markerXpos1+radius, ypos2+radius, radius, 0, 2 * Math.PI, false);
                    ctx.stroke();
                    ctx.beginPath();
                } else if (absolutePos === -1) {
                    var ypos3 = chord.parsed.sizes.ystart - chord.parsed.sizes.fretWidth;
                    var markerXpos2 = xpos + ((chord.parsed.sizes.dotWidth - chord.parsed.sizes.markerWidth) / 2);
                    if (chord.parsed.positions.baseFret === 1) {
                        ypos3 -= chord.parsed.sizes.nutHeight;
                    }
                    ctx.moveTo(markerXpos2, ypos3);
                    ctx.lineTo(markerXpos2 + chord.parsed.sizes.markerWidth, ypos3 + chord.parsed.sizes.markerWidth);
                    ctx.moveTo(markerXpos2, ypos3 + chord.parsed.sizes.markerWidth);
                    ctx.lineTo(markerXpos2 + chord.parsed.sizes.markerWidth, ypos3);
                    ctx.stroke();
                    ctx.beginPath();
                }
            }
            ctx.stroke();
   },
   drawBox : function(ctx,chord) {
       ctx.beginPath();
       ctx.strokeStyle= chord.style.color;
       ctx.fillStyle = chord.style.color !== undefined ? chord.style.color : '#000';
       var totalFretWidth = chord.parsed.sizes.fretWidth + chord.parsed.sizes.lineWidth;
       for (var i = 0; i <= chord.parsed.sizes.fretCount; i++) {
                var x1 = chord.parsed.sizes.xstart;
                var y1 = chord.parsed.sizes.ystart + i * totalFretWidth;
                var x2 = chord.parsed.sizes.xstart + chord.parsed.sizes.boxWidth - chord.parsed.sizes.lineWidth;
                var y2 = y1;
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
       }
       for (var i2 = 0; i2 < chord.parsed.sizes.stringCount; i2++) {
                var x21 = chord.parsed.sizes.xstart + (i2 * totalFretWidth);
                var y21 = chord.parsed.sizes.ystart;
                var x22 = x21;
                var y22 = chord.parsed.sizes.ystart + chord.parsed.sizes.boxHeight - chord.parsed.sizes.lineWidth;
                ctx.moveTo(x21, y21);
                ctx.lineTo(x22, y22);
       }
       ctx.stroke();

   },
   newBgCanvas : function(el,chord) {
      return this.newChordCanvas(el,chord,this.CLASS_CANVAS_BG);
   },
   newFgCanvas : function(el, chord) {
      return this.newChordCanvas(el,chord,this.CLASS_CANVAS_FG);

   },
   newChordCanvas : function(el,chord,clz) {
      var canvas = document.createElement('canvas');
      canvas.className= clz;
          canvas.style['top']='0';
      canvas.style['left']='0';
      canvas.style.position='absolute';
      this.updateCanvasDimensions(el,chord,canvas);
      el.appendChild(canvas);
      return canvas;
   },
   updateCanvasDimensions : function(el,chord,canvas) {
      el.style.width = chord.parsed.sizes.imageWidth + 'px';
      canvas.setAttribute('width',chord.parsed.sizes.imageWidth);
      el.style.height = chord.parsed.sizes.imageHeight + 'px';
      canvas.setAttribute('height',chord.parsed.sizes.imageHeight);
   },
   clearCanvas : function(canvas) {
        var context= canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
   },

   renderElements : function(elements) {
        for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                this.renderElement(el, i);
        }
   },

   renderElement : function(el) {
        var chordPos = el.getAttribute('data-positions');
        if(chordPos !== null && chordPos !== undefined) {
                //get or make name
                var chordName;
                if(el.hasAttribute('data-name')) {
                        chordName= el.getAttribute('data-name');
                } else if(el.firstChild.nodeType === 3) {
                        chordName= el.firstChild.nodeValue;
                } else if(el.firstChild.firstChild.nodeType === 3) {
                        //try getting the first child's first child
                        chordName= el.firstChild.firstChild.nodeValue;
                } else {
                        chordName="";
                }
                //important for re-jiggery
                if(!el.getAttribute('data-name')) { el.setAttribute('data-name', chordName); }

               var chord= {
                  positions : chordPos,
                  fingers : el.getAttribute('data-fingers'),
                  size : el.getAttribute('data-size'),
                  name : chordName,
                  style : el.style,
                  tuning : el.getAttribute('data-tuning'),
                  lefty : (el.getAttribute('data-lefty') === 'true') ? true : false
               };
               //console.log(chord);
               chord.parsed = ChordialJS.parse.parse(chord);
               var canvasHolder= ChordialJS.getFirstChildTagClass(el,"DIV",this.CLASS_CANVASDIV);
               var bgCanvas,fgCanvas;
               bgCanvas= ChordialJS.getFirstChildTagClass(canvasHolder,"CANVAS",this.CLASS_CANVAS_BG);
               fgCanvas= ChordialJS.getFirstChildTagClass(canvasHolder,"CANVAS",this.CLASS_CANVAS_FG);
               var drawBox=false;

               if(bgCanvas === undefined) {
                  bgCanvas= ChordialJS.render.newBgCanvas(canvasHolder,chord);
                  fgCanvas= ChordialJS.render.newFgCanvas(canvasHolder,chord);
                  drawBox=true;
                }  else {
                  //console.log(bgCanvas.getAttribute('width') + ' ' +chord.parsed.sizes.imageWidth);
                  if(parseInt(bgCanvas.getAttribute('width'),10) !== chord.parsed.sizes.imageWidth) {
                     this.updateCanvasDimensions(canvasHolder,chord,bgCanvas);
                     this.updateCanvasDimensions(canvasHolder,chord,fgCanvas);
                     this.clearCanvas(bgCanvas);
                     drawBox=true;
                  }
                  this.clearCanvas(fgCanvas);
                }
               if(drawBox) {
                  var bgCtx= bgCanvas.getContext('2d');
                  ChordialJS.render.drawBox(bgCtx, chord);
               }
                var fgCtx= fgCanvas.getContext('2d');
                if(!chord.parsed.positions.error) {
                    //console.log("Parsed chord OK");
                    ChordialJS.render.drawPositions(fgCtx, chord);
                    ChordialJS.render.drawBarres(fgCtx, chord);
                    var fingerCharSize= ChordialJS.render.drawFingers(fgCtx, chord);
                    ChordialJS.render.drawNotes(fgCtx, chord, fingerCharSize);
                    ChordialJS.render.drawBaseFret(fgCtx, chord);
                } else {
                   //log?
                   console.log("Error parsing chord");
                }
                //ChordialJS.draw.drawName(ctx, chord);
                // TODO: don't remove existing child nodes - clear and re-use canvas.
        } else {
                //cant render a chord without data-positions
                //console.log("No data-positions available to draw a chord");
        }
   }
};


var ChordialJS = ChordialJS || {};
ChordialJS.data = {
 chords : {
  //tuning
  standard : {
  //type
   major : {
        'A'    : { 'open' : ['X02220','--123-'] },
        'A#'   : { 'open' : ['X13331','-13331'] },
        'B'    : { 'open' : ['X24442','-13331'] },
        'C'    : { 'open' : ['X32010','-32-1-'] },
        'C#'   : { 'open' : ['X46664','-13331'] },
        'D'    : { 'open' : ['XX0232','---132'] },
        'D#'   : { 'open' : ['XX1343','--1243'] },
        'E'    : { 'open' : ['022100','-231--'] },
        'F'    : { 'open' : ['133211','134211'] },
        'F#'   : { 'open' : ['244322','134211'] },
        'G'    : { 'open' : ['320003','21---3'] },
        'G#'   : { 'open' : ['466544','134211'] }
   },
   minor : {
        'A'    : { 'open' : ['X02210','--231-'] },
        'A#'   : { 'open' : ['X13321','-13421'] },
        'B'    : { 'open' : ['X24432','-13421'] },
        'C'    : { 'open' : ['X35543','-13421'] },
        'C#'   : { 'open' : ['X46654','-13421'] },
        'D'    : { 'open' : ['XX0231','---132'] },
        'D#'   : { 'open' : ['XX4342','--3241'] },
        'E'    : { 'open' : ['022000','-23---'] },
        'F'    : { 'open' : ['133111','134111'] },
        'F#'   : { 'open' : ['244222','134111'] },
        'G'    : { 'open' : ['355333','134111'] },
        'G#'   : { 'open' : ['466444','134111'] }
   },
   seven : {
        'A'    : { 'open' : ['X02020','--1-3-'] },
        'A#'   : { 'open' : ['X13131','-12131'] },
        'B'    : { 'open' : ['X21202','-213-4'] },
        'C'    : { 'open' : ['X32310','-32-1-'] },
        'C#'   : { 'open' : ['X46464','-12131'] },
        'D'    : { 'open' : ['XX0212','---213'] },
        'D#'   : { 'open' : ['XX1313','--1213'] },
        'E'    : { 'open' : ['020100','-2-1--'] },
        'F'    : { 'open' : ['131211','131211'] },
        'F#'   : { 'open' : ['242322','131211'] },
        'G'    : { 'open' : ['320001','32---1'] },
        'G#'   : { 'open' : ['464544','131211'] }
   },
   'sus2' : {
        'A'    : { 'open' : ['X02200','--12--'] },
        'A#'   : { 'open' : ['X13311','-12311'] },
        'B'    : { 'open' : ['X24422','-12311'] },
        'C'    : { 'open' : ['X30013','-3--12'] },
        'C#'   : { 'open' : ['X46644','-12311'] },
        'D'    : { 'open' : ['XX0230','---21-'] },
        'D#'   : { 'open' : ['XX1341','--1231'] },
        'E'    : { 'open' : ['024400','-123--'] },
        'F'    : { 'open' : ['XX3013','--2-13'] },
        'F#'   : { 'open' : ['X9BB99','-12311'] },
        'G'    : { 'open' : ['300033','1---23'] },
        'G#'   : { 'open' : ['4111XX','3111--'] }
   },
   'sus4' : {
        'A'    : { 'open' : ['X00230','---12-'] },
        'A#'   : { 'open' : ['X11341','-11341'] },
        'B'    : { 'open' : ['X22452','-11341'] },
        'C'    : { 'open' : ['88AA88','112311'] },
        'C#'   : { 'open' : ['99BB99','112311'] },
        'D'    : { 'open' : ['XX0233','---134'] },
        'D#'   : { 'open' : ['XX1344','--1234'] },
        'E'    : { 'open' : ['002200','--23--'] },
        'F'    : { 'open' : ['113311','112311'] },
        'F#'   : { 'open' : ['224422','112311'] },
        'G'    : { 'open' : ['335533','112311'] },
        'G#'   : { 'open' : ['446644','112311'] }

   },
   diminished : {
        'A'    : { 'open' : ['X0121X','--132-'] },
        'A#'   : { 'open' : ['XXX320','---21-'] },
        'B'    : { 'open' : ['X2343X','-1243-'] },
        'C'    : { 'open' : ['X3454X','-1243-'] },
        'C#'   : { 'open' : ['X42020','-31-2-'] },
        'D'    : { 'open' : ['XX0134','---134'] },
        'D#'   : { 'open' : ['XX1242','--1242'] },
        'E'    : { 'open' : ['0120XX','-12---'] },
        'F'    : { 'open' : ['XX3404','--21-3'] },
        'F#'   : { 'open' : ['2342XX','1231--'] },
        'G'    : { 'open' : ['3453XX','1231--'] },
        'G#'   : { 'open' : ['42040X','21-3--'] }
   }
  },
  //gCEA tuning
  ukulele : {
    major : {
        'A'     : { 'open' : ['2100','21--'] },
        'A#'    : { 'open' : ['3211','3211'] },
        'B'     : { 'open' : ['4322','3211'] },
        'C'     : { 'open' : ['0003','---3'] },
        'C#'    : { 'open' : ['1114','1114'] },
        'D'     : { 'open' : ['2220','111-'] },
        'D#'    : { 'open' : ['0331','-231'] },
        'E'     : { 'open' : ['4442','2341'] },
        'F'     : { 'open' : ['2010','2-1-'] },
        'F#'    : { 'open' : ['3121','3121'] },
        'G'     : { 'open' : ['0232','-132'] },
        'G#'    : { 'open' : ['5343','3121'] }
    },
    minor : {
        'A'     : { 'open' : ['2000','2---'] },
        'A#'    : { 'open' : ['3111','3111'] },
        'B'     : { 'open' : ['4222','3111'] },
        'C'     : { 'open' : ['0333','-123'] },
        'C#'    : { 'open' : ['1444','1222'] },
        'D'     : { 'open' : ['2210','231-'] },
        'D#'    : { 'open' : ['3321','3421'] },
        'E'     : { 'open' : ['4432','3421'] },
        'F'     : { 'open' : ['1013','1-24'] },
        'F#'    : { 'open' : ['2120','213-'] },
        'G'     : { 'open' : ['0231','-231'] },
        'G#'    : { 'open' : ['1342','1342'] }
    },
    seven : {
        'A'     : { 'open' : ['0100','-1--'] },
        'A#'    : { 'open' : ['1211','1211'] },
        'B'     : { 'open' : ['2322','1211'] },
        'C'     : { 'open' : ['0001','---1'] },
        'C#'    : { 'open' : ['1112','1112'] },
        'D'     : { 'open' : ['2223','1112'] },
        'D#'    : { 'open' : ['3334','1112'] },
        'E'     : { 'open' : ['1202','12-3'] },
        'F'     : { 'open' : ['2313','2314'] },
        'F#'    : { 'open' : ['3424','2314'] },
        'G'     : { 'open' : ['0212','-213'] },
        'G#'    : { 'open' : ['1323','1324'] }
    },
    'sus2' : {
        'A'     : { 'open' : ['2400','24--'] },
        'A#'    : { 'open' : ['3011','3-11'] },
        'B'     : { 'open' : ['4122','3122'] },
        'C'     : { 'open' : ['0233','-233'] },
        'C#'    : { 'open' : ['1344','1233'] },
        'D'     : { 'open' : ['X200','-2--'] },
        'D#'    : { 'open' : ['X311','-211'] },
        'E'     : { 'open' : ['X422','-211'] },
        'F'     : { 'open' : ['0033','--33'] },
        'F#'    : { 'open' : ['X644','-211'] },
        'G'     : { 'open' : ['0230','-12-'] },
        'G#'    : { 'open' : ['1341','1231'] }
    },
    'sus4' : {
        'A'     : { 'open' : ['2200','22--'] },
        'A#'    : { 'open' : ['3311','2311'] },
        'B'     : { 'open' : ['4402','2301'] },
        'C'     : { 'open' : ['5533','2311'] },
        'C#'    : { 'open' : ['6644','2311'] },
        'D'     : { 'open' : ['X230','-23-'] },
        'D#'    : { 'open' : ['8866','2311'] },
        'E'     : { 'open' : ['9977','2311'] },
        'F'     : { 'open' : ['XX11','--11'] },
        'F#'    : { 'open' : ['XX22','--22'] },
        'G'     : { 'open' : ['0033','--33'] },
        'G#'    : { 'open' : ['11XX','11--'] }
    },
    diminished : {
        'A'     : { 'open' : ['X986','-321'] },
        'A#'    : { 'open' : ['3404','12-3'] },
        'B'     : { 'open' : ['XBA8','-321'] },
        'C'     : { 'open' : ['XCB9','-321'] },
        'C#'    : { 'open' : ['XDEA','-321'] },
        'D'     : { 'open' : ['XXAB','--12'] },
        'D#'    : { 'open' : ['X320','-21-'] },
        'E'     : { 'open' : ['X431','-321'] },
        'F'     : { 'open' : ['X542','-321'] },
        'F#'    : { 'open' : ['X653','-321'] },
        'G'     : { 'open' : ['0131','-131'] },
        'G#'    : { 'open' : ['X875','-321'] }
    }
  }
 },
 tunings : {
        standard: ['E2','A2','D3','G3','B3','E4'],
        ukulele: ['G4','C4','E4','A4']
 },
 degreeNames : {
   major: [ 'I','II','III','IV','V','VI','VII' ],
   minor: [ 'i','ii','iii','iv','v','vi','vii' ]
  },

//Major:        I       ii      iii     IV      V       vi      vii°
//Minor:        i       ii°     III     iv      v       VI      VII     vii°
  progressions : {
        heptatonic : {
                'I-IV-V' : [ { degree : 1 }, { degree : 4 }, { degree : 5  }],
                'I-IV-V (barre)' : [ { degree : 1, fingering : 'barre:E-shape' }, { degree : 4, fingering: 'barre:A-shape' }, { degree : 5, fingering: 'barre:A-shape' }],
                'I-IV-V7' : [{ degree : 1 }, { degree : 4 }, { degree : 5, family : 'seven'}],
                '50s'   : [ { degree : 1 }, {degree : 6}, { degree : 4 }, { degree : 5  }],
                //I-IV-viio-iii-vi-ii-V-I = Circle
                'Circle' : [
                        { degree : 1 }, {degree : 4 }, { degree : 7 }, { degree : 3  },
                        { degree : 6 }, {degree : 2 }, { degree : 5 }
                     ],
                'Full Scale' : [ { degree : 1 }, { degree : 2 }, { degree : 3}, { degree : 4}, { degree : 5}, { degree :6}, { degree : 7 } ]
                }
 },
 scales : {
        degrees : {
                major : [1,3,5,6,8,10,12],
                minor : [1,3,4,6,8,10,11]
        },
        chordtypes : { //for each degree ...
                major : ['major','minor',     'minor','major','major','minor','diminished'],
                minor : ['minor','diminished','major','minor','minor','major','major'] //natural
        }
 },
 notes : ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
 chordTypes : {
      // standard abbr first
      abbreviations : {
         major : ['','maj'],
         minor : ['m','min'],
         seven : ['7','seventh'],
         diminished : ['o','dim'],
         sus2 : ['sus2','sus'],
         sus4 : ['sus4']
      }
  }
};

