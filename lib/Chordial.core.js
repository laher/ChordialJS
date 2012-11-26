/**
 * Chordial.js - a chord library for ChordJS
 *
 * Copyright (C) 2012 Am Laher [am@laher.net.nz]
 *
 * Chordial uses [my fork of] ChordJS, which was originally developed by Aaron Spike [aaron@ekips.org]
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * MIT License for more details.
 *
 * NOTE: There must be more mathematical way to represent some of this stuff.
 * NOTE: IANAM (I am not a musician!)
 */

var ChordialJS = {};
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
ChordialJS.makeChord= function(container,note,options,typ,name) {
	if(typ === undefined) { typ='major'; }
	if(options === undefined) { options= {}; }
	if(options['size'] === undefined) { options['size']=3; }
	if(options['tuning'] === undefined) { options['tuning'] = 'standard'; }
	if(name === undefined) { name = note + ChordialJS.data.chordTypes.abbreviations[typ]; }
	var span= document.createElement('span');
	span.setAttribute('data-name',name);
	var positions= ChordialJS.data.chords[options['tuning']][typ][ChordialJS.normaliseNote(note)][0][0];
	var fingers= ChordialJS.data.chords[options['tuning']][typ][ChordialJS.normaliseNote(note)][0][1];
	if(options['lefty']) {
		positions= ChordialJS.reverseString(positions);
		fingers= ChordialJS.reverseString(fingers);
	}
	span.setAttribute('data-positions',positions);
	span.setAttribute('data-fingers',fingers);
	span.setAttribute('data-size',options['size']);
	span.appendChild(document.createTextNode(name));
	container.appendChild(span);
};

