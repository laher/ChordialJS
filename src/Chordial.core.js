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
//turn a flat into a sharp for look-ups
ChordialJS.normaliseNote= function(note) {
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


};
ChordialJS.reverseString= function(input) {
	return input.split("").reverse().join("");
};

ChordialJS.renderChord= function(container,note,options,family,name) {
	var span= ChordialJS.makeChord(container,note,options,family,name);
	ChordialJS.renderElement(span);
};

ChordialJS.makeChord= function(container,note,options,family,name) {
	if(family === undefined) { family='major'; }
	if(options === undefined) { options= {}; }
	if(options['size'] === undefined) { options['size']=3; }
	if(options['tuning'] === undefined) { options['tuning'] = 'standard'; }
	if(name === undefined) { name = note +
 (ChordialJS.data.chordTypes.abbreviations[family] !== undefined ?
	ChordialJS.data.chordTypes.abbreviations[family] : family); }
	var holder= document.createElement('div');
	holder.className = 'ChordialChordContainer';
        holder.style['float']= 'left';
	holder.setAttribute('data-name',name);
	var positions= ChordialJS.data.chords[options['tuning']][family][ChordialJS.normaliseNote(note)][0][0];
	var fingers= ChordialJS.data.chords[options['tuning']][family][ChordialJS.normaliseNote(note)][0][1];
	if(options['lefty']) {
		positions= ChordialJS.reverseString(positions);
		fingers= ChordialJS.reverseString(fingers);
	}
	holder.setAttribute('data-positions',positions);
	holder.setAttribute('data-fingers',fingers);
	holder.setAttribute('data-size',options['size']);
	holder.appendChild(document.createTextNode(name));
	container.appendChild(holder);
	return holder;
};
ChordialJS.splitNameAndSuper= function(name_plain) {
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
};
ChordialJS.makeScale = function(family,root) {
	var allNotes= ChordialJS.getAllNotesFromRoot(root);
	var intervals= ChordialJS.data.scales.intervals[family];
	var scale=[];
	scale.push(root);
	var noteIndex=0;
	for(var i=0;i<intervals.length;i++) {
		noteIndex+=intervals[i];
		scale.push(allNotes[noteIndex]);
	}
	return scale;
};
ChordialJS.getAllNotesFromRoot= function(root) {
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
};

