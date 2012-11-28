/** Chordial - v0.0.3 - 2012-11-29
 * http://laher.github.com/ChordialJS/
 * Copyright (c) 2012 ; Licensed  
 */

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
ChordialJS.draw= {};
ChordialJS.parse= {};

ChordialJS.parse.parseChord = function(chord) {
     if (chord === null || 
		typeof chord === 'undefined' || 
		(!chord.match(/[\dxX]{6}|((1|2)?[\dxX]-){5}(1|2)?[\dxX]/) && !chord.match(/[\dxX]{4}|((1|2)?[\dxX]-){3}(1|2)?[\dxX]/))
                ) {
        return { error : true };
    } else {
        var parts;
        //TODO - change to 'contains dashes'
        if (chord.length > 6) {
            parts = chord.split('-');
        } else {
            parts = chord.split('');
        }
        var ret= {
                error : false,
                chordPositions : [],
                maxFret : 0,
                minFret : 99 //big-enough number
        };
        for (var i = 0; i < chord.length; i++) {
            if (parts[i].toUpperCase() === "X") {
                ret.chordPositions[i] = -1;
            } else {
                ret.chordPositions[i] = parseInt(parts[i],10);
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
};

ChordialJS.parse.parseFingers = function(chord,fingers) {
      //fingers = String(fingers).toUpperCase()+'------';
      fingers = String(fingers).toUpperCase();
      fingers = fingers.replace(/[^\-T1234]/g,'');
      var fingersArray = fingers.split('');
      return fingersArray;
};
ChordialJS.parse.init = function(name, chord, fingers, size, style) {
	style = typeof style !== 'undefined' ? style : { 'background-color' : '#fff' };
	style['color'] = style['color'] ? style['color'] : '#000';
	style['font-family'] = style['font-family'] ? style['font-family'] : 'Arial';
        var stringCount= chord.length;
        //ukes show n frets. Guitars 5.
        var fretCount= stringCount > 4 ? stringCount-1 : stringCount;
        var fretWidth= 4*size;
        var nutHeight = fretWidth / 2;
        var markerWidth = 0.7 * fretWidth;
        var lineWidth = Math.ceil(size * 0.31);
        var dotWidth = Math.ceil(0.9 * fretWidth);
        var perc = 0.8;
        var fretFontSize = fretWidth / perc;
        var fingerFontSize = fretWidth * 0.8;
        var nameFontSize = fretWidth * 2 / perc;
        var superScriptFontSize = 0.7 * nameFontSize;
        if (size === 1) {
                nameFontSize += 2;
                fingerFontSize += 2;
                fretFontSize += 2;
                superScriptFontSize += 2;
        }

        var xstart = fretWidth;
        var ystart = Math.round(0.2 * superScriptFontSize + nameFontSize + nutHeight + 1.7 * markerWidth);

        var boxWidth = (stringCount-1) * fretWidth + (stringCount) * lineWidth;
        var boxHeight = fretCount * (fretWidth + lineWidth) + lineWidth;
        var imageWidth = (boxWidth + 3 * fretWidth);
        var imageHeight = (boxHeight + ystart + fretWidth + fretWidth);

        var signWidth = (fretWidth * 0.75);
        var signRadius = signWidth / 2;
        return {
                name : name,
                chord : chord,
                fingers : fingers,
                size : size,
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
                fingerfontSize : fingerFontSize,
                fretFontSize : fretFontSize,
                superScriptFontSize : superScriptFontSize,
                xstart : fretWidth,
                ystart : ystart,
                imageWidth : imageWidth,
                imageHeight : imageHeight,
                signWidth : signWidth,
                signRadius : signRadius,
                style : style,
                chordParsed : ChordialJS.parse.parseChord(chord),
                fingersParsed : ChordialJS.parse.parseFingers(chord,fingers)
        };
};

ChordialJS.draw.drawName = function(ctx,chord) {
            var name;
            var supers;
            if (chord.name.indexOf('_') === -1) {
                name = chord.name;
                supers = "";
            } else {
                var parts = chord.name.split('_');
                name = parts[0];
                supers = parts[1];
            }
            ctx.fillStyle = chord.style.color;
            ChordialJS.draw.setFont(ctx,chord.nameFontSize,chord.style['font-family']);
            var stringSize = ctx.measureText(name);

            var xTextStart = chord.xstart;

            if (stringSize.width < chord.boxWidth) {
                xTextStart = chord.xstart + ((chord.boxWidth - stringSize.width) / 2);
            }
            ctx.fillText(name, xTextStart, 0.2 * chord.superScriptFontSize);
            if (supers !== "") {
                ChordialJS.draw.setFont(ctx,chord.superScriptFontSize,chord.style['font-family']);
                ctx.fillText(supers, xTextStart + 0.8 * stringSize.width, 0);
                //_graphics.DrawString(supers, superFont, style.color, xTextStart + 0.8 * stringSize.Width, 0);
            }

            if (chord.chordParsed.baseFret > 1) {
                ChordialJS.draw.setFont(ctx,chord.fretFontSize,chord.style['font-family']);
                //var fretFont = Font(style['font-family'], _fretFontSize);
                var offset = (chord.fretFontSize - chord.fretWidth) / 2;
                ctx.fillText(chord.chordParsed.baseFret + "fr", chord.xstart + chord.boxWidth + 0.4 * chord.fretWidth, chord.ystart - offset);
            }
};

ChordialJS.draw.setFont = function(ctx,size,fontFamily) {
        ctx.font = size+"px "+fontFamily;
        ctx.textBaseline = 'top';
};
ChordialJS.draw.drawBarres = function(ctx,chord) {
            var bars = {};
            var bar;
            for (var i = 0; i < (chord.stringCount-1); i++) {
                if (chord.chordParsed.chordPositions[i] !== -1 && chord.chordParsed.chordPositions[i] !== 0 && chord.fingersParsed[i] !== '-' && !bars.hasOwnProperty(chord.fingersParsed[i])) {
                    bar = { 'Str':i, 'Pos': chord.chordParsed.chordPositions[i], 'Length':0, 'Finger':chord.fingersParsed[i] };
                    for (var j = i + 1; j < chord.stringCount; j++) {
                        if (chord.fingersParsed[j] === bar['Finger'] && chord.chordParsed.chordPositions[j] === chord.chordParsed.chordPositions[i]) {
                            bar['Length'] = j - i;
                        }
                    }
                    if (bar['Length'] > 0) {
                        bars[bar['Finger']] = bar;
                    }
                }
            }

            ctx.lineWidth= chord.lineWidth * 3;
            var totalFretWidth = chord.fretWidth + chord.lineWidth;
            ctx.beginPath();
            for (var b in bars) {
                //console.log(chord.name);
                //console.log(bars[b]);
                if (bars.hasOwnProperty(b)){
                    bar = bars[b];
                    var xstart = chord.xstart + bar['Str'] * totalFretWidth;
                    var xend = xstart + bar['Length'] * totalFretWidth;
                    var y = chord.ystart + (bar['Pos'] - chord.chordParsed.baseFret + 1) * totalFretWidth - (totalFretWidth / 2);
                    //ctx.lineWidth= chord.lineWidth / 2;
                    ctx.moveTo(xstart, y);
                    ctx.lineTo(xend, y);
                }
            } 
            ctx.stroke();
};
ChordialJS.draw.drawFingers = function(ctx,chord) {
        var xpos = chord.xstart + (0.5 * chord.lineWidth);
        var ypos = chord.ystart + chord.boxHeight;
        ChordialJS.draw.setFont(ctx,chord.fingerFontSize,chord.style['font-family']);
        ctx.textBaseline = 'top';
        ctx.beginPath();
        for (var f=0; f<chord.fingersParsed.length; f++) {
                var finger = chord.fingersParsed[f];
                if (finger !== '-') {
                    var charSize = ctx.measureText(finger.toString());
                    //var charSize = _graphics.MeasureString(finger.toString(), font);
                    //_graphics.DrawString(finger.toString(), font, style.color, xpos - (0.5 * charSize.Width), ypos);
                    ctx.fillText(finger.toString(), xpos - (0.5 * charSize.width), ypos);
                }
                xpos += (chord.fretWidth + chord.lineWidth);
        }
        ctx.stroke();
};
ChordialJS.draw.drawPositions = function(ctx,chord) {
            var yoffset = chord.ystart - chord.fretWidth;
            var xoffset = chord.lineWidth / 2;
            var totalFretWidth = chord.fretWidth + chord.lineWidth;
            var xfirstString = chord.xstart + 0.5 * chord.lineWidth;

            ctx.beginPath();
            ctx.fillStyle = chord.style.color;
            ctx.strokeStyle= chord.style.color;
            ctx.lineWidth= chord.lineWidth;
            ctx.lineCap= 'round';
            var radius= chord.dotWidth/2;
            for (var i = 0; i < chord.chordParsed.chordPositions.length; i++) {
                var absolutePos = chord.chordParsed.chordPositions[i];
                var relativePos = absolutePos - chord.chordParsed.baseFret + 1;
                var xpos = chord.xstart - (0.5 * chord.fretWidth) + (0.5 * chord.lineWidth) + (i * totalFretWidth);
                if (relativePos > 0) {
                    var ypos1 = relativePos * totalFretWidth + yoffset;
                    ctx.arc(xpos+radius, ypos1+radius, radius, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.beginPath();
                } else if (absolutePos === 0) {
                    var ypos2 = chord.ystart - chord.fretWidth;
                    var markerXpos1 = xpos + ((chord.dotWidth - chord.markerWidth) / 2);
                    if (chord.chordParsed.baseFret === 1) {
                        ypos2 -= chord.nutHeight;
                    }
                    ctx.arc(markerXpos1+radius, ypos2+radius, radius, 0, 2 * Math.PI, false);
                    ctx.stroke();
                    ctx.beginPath();
                } else if (absolutePos === -1) {
                    //var pen = Pen(style.color, chord.lineWidth * 1.5);
                    var ypos3 = chord.ystart - chord.fretWidth;
                    var markerXpos2 = xpos + ((chord.dotWidth - chord.markerWidth) / 2);
                    if (chord.chordParsed.baseFret === 1) {
                        ypos3 -= chord.nutHeight;
                    }
                    ctx.moveTo(markerXpos2, ypos3);
                    ctx.lineTo(markerXpos2 + chord.markerWidth, ypos3 + chord.markerWidth);
                    ctx.moveTo(markerXpos2, ypos3 + chord.markerWidth);
                    ctx.lineTo(markerXpos2 + chord.markerWidth, ypos3);
                    //_graphics.DrawLine(pen, markerXpos, ypos, markerXpos + chord.markerWidth, ypos + chord.markerWidth);
                    //_graphics.DrawLine(pen, markerXpos, ypos + chord.markerWidth, markerXpos + chord.markerWidth, ypos);
                    ctx.stroke();
                    ctx.beginPath();
                }
            }
            ctx.stroke();
};
ChordialJS.draw.drawBox = function(ctx,chord) {
       ctx.beginPath();
       ctx.strokeStyle= chord.style.color;
       ctx.fillStyle = chord.style.color !== undefined ? chord.style.color : '#000';
       var totalFretWidth = chord.fretWidth + chord.lineWidth;
       for (var i = 0; i <= chord.fretCount; i++) {
                var x1 = chord.xstart;
                var y1 = chord.ystart + i * totalFretWidth;
                var x2 = chord.xstart + chord.boxWidth - chord.lineWidth;
                var y2 = y1;
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
       }
       for (var i2 = 0; i2 < chord.stringCount; i2++) {
                var x21 = chord.xstart + (i2 * totalFretWidth);
                var y21 = chord.ystart;
                var x22 = x21;
                var y22 = chord.ystart + chord.boxHeight - chord.lineWidth;
                ctx.moveTo(x21, y21);
                ctx.lineTo(x22, y22);
       }
       ctx.stroke();
       if(chord.chordParsed.baseFret === 1) {
                ctx.beginPath();
                ctx.rect(chord.xstart - (chord.lineWidth / 2), 
                        chord.ystart - chord.nutHeight,
                        chord.boxWidth,
                        chord.nutHeight
                        );
                ctx.fill();
       }
};

ChordialJS.renderElements= function(elements) {
        for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                var chordPos = el.getAttribute('data-positions');
                if(chordPos !== null) {
                        //console.log(chordPos);
                        var chordFingers = el.getAttribute('data-fingers');
                        var chordSize = el.getAttribute('data-size');
                        var chordName = el.hasAttribute('data-name') ? el.getAttribute('data-name') : el.firstChild.nodeValue;
                        var style= el.style;
                        //important for re-jiggery
                        if(!el.getAttribute('data-name')) { el.setAttribute('data-name', chordName); }
                        var chord = ChordialJS.parse.init(chordName, chordPos, chordFingers, chordSize, style);
                        var canvas = document.createElement('canvas');
                        canvas.setAttribute('width',chord.imageWidth);
                        canvas.setAttribute('height',chord.imageHeight);
                        var ctx= canvas.getContext('2d');
                        ChordialJS.draw.drawBox(ctx, chord);
                        ChordialJS.draw.drawPositions(ctx, chord);
                        ChordialJS.draw.drawBarres(ctx, chord);
                        ChordialJS.draw.drawFingers(ctx, chord);
                        ChordialJS.draw.drawName(ctx, chord);
                        // remove existing child nodes
                        var children= el.childNodes;
                        for (var j = children.length-1; j >= 0; j--) {
                                el.removeChild(children[j]);
                        }
                        el.appendChild(canvas);
                }
        }
};

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

