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
        'B'    : { 'open' : ['X2340X','-123--'] },
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

