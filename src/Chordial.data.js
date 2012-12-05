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
   minor : {
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
   seven : {
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
   },
   'sus2' : {
        'A'    : [['X02200','--12--']],
        'A#'   : [['X13311','-12311']],
        'B'    : [['X24422','-12311']],
        'C'    : [['X30013','-3--12']],
        'C#'   : [['X46644','-12311']],
        'D'    : [['XX0230','---21-']],
        'D#'   : [['XX1341','--1231']],
        'E'    : [['024400','-123--']],
        'F'    : [['XX3013','--2-13']],
        'F#'   : [['X9BB99','-12311']],
        'G'    : [['300033','1---23']],
        'G#'   : [['4111XX','3111--']]
   },
   'sus4' : {
        'A'    : [['X00230','---12-']],
        'A#'   : [['X11341','-11341']],
        'B'    : [['X22452','-11341']],
        'C'    : [['88AA88','112311']],
        'C#'   : [['99BB99','112311']],
        'D'    : [['XX0233','---134']],
        'D#'   : [['XX1344','--1234']],
        'E'    : [['002200','--23--']],
        'F'    : [['113311','112311']],
        'F#'   : [['224422','112311']],
        'G'    : [['335533','112311']],
        'G#'   : [['446644','112311']]

   },
   diminished : {
        'A'    : [['X0121X','--132-']],
        'A#'   : [['XXX320','---21-']],
        'B'    : [['X2340X','-123--']],
        'C'    : [['X3454X','-1243-']],
        'C#'   : [['X42020','-31-2-']],
        'D'    : [['XX0134','---134']],
        'D#'   : [['XX1242','--1242']],
        'E'    : [['0120XX','-12---']],
        'F'    : [['XX3404','--21-3']],
        'F#'   : [['2342XX','1231--']],
        'G'    : [['3453XX','1231--']],
        'G#'   : [['42040X','21-3--']]
   }
  },
  //gCEA tuning
  ukulele : {
    major : {
        'A'     : [['2100','21--']],
        'A#'    : [['3211','3211']],
        'B'     : [['4322','3211']],
        'C'     : [['0003','---3']],
        'C#'    : [['1114','1114']],
        'D'     : [['2220','111-']],
        'D#'    : [['0331','-231']],
        'E'     : [['4442','2341']],
        'F'     : [['2010','2-1-']],
        'F#'    : [['3121','3121']],
        'G'     : [['0232','-132']],
        'G#'    : [['5343','3121']]
    },
    minor : {
        'A'     : [['2000','2---']],
        'A#'    : [['3111','3111']],
        'B'     : [['4222','3111']],
        'C'     : [['0333','-123']],
        'C#'    : [['1444','1222']],
        'D'     : [['2210','231-']],
        'D#'    : [['3321','3421']],
        'E'     : [['4432','3421']],
        'F'     : [['1013','1-24']],
        'F#'    : [['2120','213-']],
        'G'     : [['0231','-231']],
        'G#'    : [['1342','1342']]
    },
    seven : {
        'A'     : [['0100','-1--']],
        'A#'    : [['1211','1211']],
        'B'     : [['2322','1211']],
        'C'     : [['0001','---1']],
        'C#'    : [['1112','1112']],
        'D'     : [['2223','1112']],
        'D#'    : [['3334','1112']],
        'E'     : [['1202','12-3']],
        'F'     : [['2313','2314']],
        'F#'    : [['3424','2314']],
        'G'     : [['0212','-213']],
        'G#'    : [['1323','1324']]
    },
    'sus2' : {
        'A'     : [['2400','24--']],
        'A#'    : [['3011','3-11']],
        'B'     : [['4122','3122']],
        'C'     : [['0233','-233']],
        'C#'    : [['1344','1233']],
        'D'     : [['X200','-2--']],
        'D#'    : [['X311','-211']],
        'E'     : [['X422','-211']],
        'F'     : [['0033','--33']],
        'F#'    : [['X644','-211']],
        'G'     : [['0230','-12-']],
        'G#'    : [['1341','1231']]
    },
    'sus4' : {
        'A'     : [['2200','22--']],
        'A#'    : [['3311','2311']],
        'B'     : [['4402','2301']],
        'C'     : [['5533','2311']],
        'C#'    : [['6644','2311']],
        'D'     : [['X230','-23-']],
        'D#'    : [['8866','2311']],
        'E'     : [['9977','2311']],
        'F'     : [['XX11','--11']],
        'F#'    : [['XX22','--22']],
        'G'     : [['0033','--33']],
        'G#'    : [['11XX','11--']]
    },
    diminished : {
        'A'     : [['X986','-321']],
        'A#'    : [['3404','12-3']],
        'B'     : [['XBA8','-321']],
        'C'     : [['XCB9','-321']],
        'C#'    : [['XDEA','-321']],
        'D'     : [['XXAB','--12']],
        'D#'    : [['X320','-21-']],
        'E'     : [['X431','-321']],
        'F'     : [['X542','-321']],
        'F#'    : [['X653','-321']],
        'G'     : [['0131','-131']],
        'G#'    : [['X875','-321']]
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

