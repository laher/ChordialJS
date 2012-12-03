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
      if(definition.size === undefined) { definition.size=3; }
      if(definition.tuning === undefined) { definition.tuning = 'standard'; }
      if(definition.name === undefined) { definition.name = definition.note +
         (ChordialJS.data.chordTypes.abbreviations[definition.family] !== undefined ?
         ChordialJS.data.chordTypes.abbreviations[definition.family] : definition.family);
      }
      return definition;
   },

   makeChordContainer : function(chord) {
   //make a container div
        var holder= document.createElement('div');
        holder.className = 'ChordialChordContainer';
        holder.style['float']= 'left';
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

   updateChordContainer : function(chord,holder) {
        holder.setAttribute('data-name',chord.name);
   //look up positions & fingers
        var positions= ChordialJS.data.chords[chord.tuning][chord.family][this.normaliseNote(chord.note)][0][0];
        var fingers= ChordialJS.data.chords[chord.tuning][chord.family][this.normaliseNote(chord.note)][0][1];
        if(chord.lefty) {
                positions= this.reverseString(positions);
                fingers= this.reverseString(fingers);
        }
   //set attributes
        holder.setAttribute('data-positions', positions);
        holder.setAttribute('data-fingers', fingers);
        holder.setAttribute('data-size', chord.size);
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
   makeScale : function(family,root) {
        var allNotes= this.getAllNotesFromRoot(root);
        var intervals= ChordialJS.data.scales.intervals[family];
        var scale=[];
        scale.push(root);
        var noteIndex=0;
        for(var i=0;i<intervals.length;i++) {
                noteIndex+=intervals[i];
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

   renderChords : function(parentElement, definitions) {
      var existingCharts= this.getExistingCharts(parentElement);
      for(var i=0; i<definitions.length; i++) {
         var container;
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


