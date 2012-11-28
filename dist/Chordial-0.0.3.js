/*! Chordial - v0.0.3 - 2012-11-28
* http://laher.github.com/ChordialJS/
 * Copyright (c) 2012 ; Licensed  
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
 *
 * NOTE: There must be more mathematical way to represent some of this stuff.
 * NOTE: IANAM (I am not a musician!)
 */
var ChordialJS = ChordialJS || {};
ChordialJS.data = {
 'chords' : {
  //tuning
  'standard' : {
  //type
   'major' : {
	'A'    : [['X02220','--123-']],
	'A#'   : [['X13331','-13331']],
	'B'    : [['X24442','-13331']],
	'C'    : [['X32010','-32-1-']],
	'C#'   : [['X46664','-13331']],
	'D'    : [['XX0232','---132']],
	'D#'   : [['XX1343','--1243']],
	'E'    : [['022100','-231--']],
	'F'    : [['133211','134211']],
	'F#'   : [['244322','134211']],
	'G'    : [['320003','21---3']],
	'G#': [['466544','134211']]
   },
   'minor' : {
	'A'    : [['X02210','--231-']],
	'A#'   : [['X13321','-13421']],
	'B'    : [['X24432','-13421']],
	'C'    : [['X35543','-13421']],
	'C#'   : [['X46654','-13421']],
	'D'    : [['XX0231','---132']],
	'D#'   : [['XX4342','--3241']],
	'E'    : [['022000','-23---']],
	'F'    : [['133111','134111']],
	'F#'   : [['244222','134111']],
	'G'    : [['355333','134111']],
	'G#'   : [['466444','134111']]
   },
   'seven' : {
	'A'    : [['X02020','--1-3-']],
	'A#'   : [['X13131','-12131']],
	'B'    : [['X21202','-213-4']],
	'C'    : [['X32310','-32-1-']],
	'C#'   : [['X46464','-12131']],
	'D'    : [['XX0212','---213']],
	'D#'   : [['XX1313','--1213']],
	'E'    : [['020100','-2-1--']],
	'F'    : [['131211','131211']],
	'F#'   : [['242322','131211']],
	'G'    : [['320001','32---1']],
	'G#'   : [['464544','131211']]
   }
  },
  //gCEA tuning
  'ukulele' : {
    'major' : {
	'A'	: [['2100','21--']],
	'A#'	: [['3211','3211']],
	'B'	: [['4322','3211']],
	'C'	: [['0003','---3']],
	'C#'	: [['1114','1114']],
	'D'	: [['2220','111-']],
	'D#'	: [['0331','-231']],
	'E'	: [['4442','2341']],
	'F'	: [['2010','2-1-']],
	'F#'	: [['3121','3121']],
	'G'	: [['0232','-132']],
	'G#'	: [['5343','3121']]
    },
    'minor' : {
	'A'	: [['2000','2---']],
	'A#'	: [['3111','3111']],
	'B'	: [['4222','3111']],
	'C'	: [['0333','-123']],
	'C#'	: [['1444','1222']],
	'D'	: [['2210','231-']],
	'D#'	: [['3321','3421']],
	'E'	: [['4432','3421']],
	'F'	: [['1013','1-24']],
	'F#'	: [['2120','213-']],
	'G'	: [['0231','-231']],
	'G#'	: [['1342','1342']]
    },
    'seven' : {
	'A'	: [['0100','-1--']],
	'A#'	: [['1211','1211']],
	'B'	: [['2322','1211']],
	'C'	: [['0001','---1']],
	'C#'	: [['1112','1112']],
	'D'	: [['2223','1112']],
	'D#'	: [['3334','1112']],
	'E'	: [['1202','12-3']],
	'F'	: [['2313','2314']],
	'F#'	: [['3424','2314']],
	'G'	: [['0212','-213']],
	'G#'	: [['1323','1324']]
    }
  }
 },
 'tunings' : {
	'standard': ['E2','A2','D3','G3','B3','E4'],
	'ukulele': ['G4','C4','E4','A4']
 },
 'degrees' : {
	'major':
		[ 'I','II','III','IV','V','VI','VII' ],
	'minor':
		[ 'i','ii','iii','iv','v','vi','vii' ]
  },

//Major:	I	ii	iii	IV	V	vi	vii°
//Minor:	i	ii°	III	iv	v	VI	VII	vii°
  'progressions' : {
	'major':
		{
		'I-IV-V' :	['I','IV','V'],
		'I-IV-V7' :	['I','IV','V7'],
		'50s'	:	['I','vi','IV','V'],
		//I-IV-viio-iii-vi-ii-V-I = Circle
		'Circle' :	['I','IV','viio','iii','vi','ii','V','I']
			
		},
	'minor':
		{
		'Dominant Cadence' :	['i','V','I']
		
		}
 },

//TODO: VII chord should be a 'dim'
//TODO: Minor scales
 'scales': {
    'major' : {
	'Ab'    : [['Ab'],['Bb','minor'], ['C','minor'],['Db'],['Eb'], ['F','minor'],['G']],
	'A'    : [['A'],['B','minor'], ['C#','minor'],['D'],['E'], ['F#','minor'],['G#']],
	'Bb'    : [['Bb'],['C','minor'],['D','minor'],['Eb'],['F'],['G','minor'],['A']],
	'B'    : [['B'],['C#','minor'],['D#','minor'],['E'],['F#'],['G#','minor'],['A#']],
	'Cb'    : [['Cb'],['Db','minor'], ['Eb','minor'], ['Fb'],['Gb'], ['Ab','minor'], ['Bb']],
	'C'    : [['C'],['D','minor'], ['E','minor'], ['F'],['G'], ['A','minor'], ['B']],
	'Db'    : [['Db'],['Eb','minor'], ['F','minor'],['Gb'],['Ab'], ['Bb','minor'], ['C']],
	'D'    : [['D'],['E','minor'], ['F#','minor'],['G'],['A'], ['B','minor'], ['C#']],
	'Eb'   : [['Eb'],['F','minor'],['G','minor'],['Ab'],['Bb'], ['C','minor'],['D']],
	'E'    : [['E'],['F#','minor'],['G#','minor'],['A'],['B'], ['C#','minor'],['D#']],
	'F'    : [['F'],['G','minor'], ['A','minor'], ['Bb'],['C'],['D','minor'], ['E']],
	'Gb'   : [['Gb'],['Ab','minor'], ['Bb','minor'], ['Cb'],['Db'], ['Eb','minor'], ['F']],
	'G'    : [['G'],['A','minor'], ['B','minor'], ['C'],['D'], ['E','minor'], ['F#']]
    }
  },
  'chordTypes' : {
    'abbreviations' : {
	'major' : '',
	'minor' : 'm',
	'seven' : '7',
	'diminished' : 'o'
   }
  }
};

