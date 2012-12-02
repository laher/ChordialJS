/** Chordial - v0.0.5 - 2012-12-02
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
   //get existing charts. TODO! integrate this!
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
   makeChord : function(parentElement,note,options,family,name) { //name family and options are optional
      var chord= this.cleanInput(note,options,family,name);
      var container= this.makeChordContainer(chord);
      parentElement.appendChild(container);
      return container;
   },

   cleanInput : function(note,options,family,name) { //name family and options are optional
      //clean input
	if(family === undefined) { family='major'; }
	if(options === undefined) { options= {}; }
	if(options['size'] === undefined) { options['size']=3; }
	if(options['tuning'] === undefined) { options['tuning'] = 'standard'; }
	if(name === undefined) { name = note +
 (ChordialJS.data.chordTypes.abbreviations[family] !== undefined ?
	ChordialJS.data.chordTypes.abbreviations[family] : family); }
        return {
            name: name,
            size: options['size'],
            note: note,
            tuning: options['tuning'],
            family: family
        };
   },

   makeChordContainer : function(chord) {
   //make a container div
	var holder= document.createElement('div');
	holder.className = 'ChordialChordContainer';
        holder.style['float']= 'left';
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
	holder.appendChild(document.createTextNode(chord.name));
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
   }
};


ChordialJS.renderChord = function(parentElement,note,options,family,name) {
	var container= ChordialJS.makeChord(parentElement,note,options,family,name);
	ChordialJS.renderElement(container);
};



var ChordialJS = ChordialJS || {};
var console = console || { log: function(){} };

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
          fingerfontSize : fingerFontSize,
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

            if (chord.parsed.positions.baseFret > 1) {
                this.setFont(ctx,chord.parsed.sizes.fretFontSize,chord.style['font-family']);
                var offset = (chord.parsed.sizes.fretFontSize - chord.parsed.sizes.fretWidth) / 2;
                ctx.fillText(chord.parsed.positions.baseFret + "fr", chord.parsed.sizes.xstart + chord.parsed.sizes.boxWidth + 0.4 * chord.parsed.sizes.fretWidth, chord.parsed.sizes.ystart - offset);
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
        var ypos = chord.parsed.sizes.ystart + chord.boxHeight;
        this.setFont(ctx,chord.parsed.sizes.fingerFontSize,chord.style['font-family']);
        ctx.textBaseline = 'top';
        ctx.beginPath();
        for (var f=0; f<chord.parsed.fingers.length; f++) {
                var finger = chord.parsed.fingers[f];
                if (finger !== '-') {
                    var charSize = ctx.measureText(finger.toString());
                    ctx.fillText(finger.toString(), xpos - (0.5 * charSize.width), ypos);
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
       if(chord.parsed.positions.baseFret === 1) {
                ctx.beginPath();
                ctx.rect(chord.parsed.sizes.xstart - (chord.parsed.sizes.lineWidth / 2),
                        chord.parsed.sizes.ystart - chord.parsed.sizes.nutHeight,
                        chord.parsed.sizes.boxWidth,
                        chord.parsed.sizes.nutHeight
                        );
                ctx.fill();
       }
   },

   newChordCanvas : function(el,chord) {
      var canvas = document.createElement('canvas');
      canvas.className= "ChordialChordCanvas";
      canvas.setAttribute('width',chord.parsed.sizes.imageWidth);
      canvas.setAttribute('height',chord.parsed.sizes.imageHeight);
      return canvas;
   },
   drawNameDiv : function(el,chord) {
    var inner= document.createElement('div');
    inner.className="ChordialNameDiv";
    inner.style['text-align']='center';
    inner.style.width='100%';
    inner.style.padding="0px";
    inner.style.margin="0px";
    var mainSpan= document.createElement('span');
    var superSpan= document.createElement('sup');
    inner.appendChild(mainSpan);
    var nameAndSuper= ChordialJS.splitNameAndSuper(chord.name);
    mainSpan.appendChild(document.createTextNode(nameAndSuper[0]));
    superSpan.appendChild(document.createTextNode(nameAndSuper[1]));
    inner.appendChild(mainSpan);
    inner.appendChild(superSpan);
    el.appendChild(inner);
   },
   clearCanvas : function(canvas) {
        var context= canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
   }
};


ChordialJS.renderElements= function(elements) {
        for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                this.renderElement(el);
        }
};



ChordialJS.renderElement= function(el) {
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
                  style : el.style
               };
               console.log(chord);
                chord.parsed = ChordialJS.parse.parse(chord);
                var children= el.childNodes;
                var canvas;
                //1. remove direct text nodes. These will be replaced with a div.
                //2. see if there's already a canvas there. If so, use it.
                for (var j = children.length-1; j >= 0; j--) {
                        if(children[j].nodeType===3) {
                                el.removeChild(children[j]);
                        } else if(children[j].nodeName === "canvas") {
                                //re-use!
                                canvas= children[j];
                        }
                }
                if(canvas === undefined) {
                        ChordialJS.render.drawNameDiv(el,chord);
                        canvas= ChordialJS.render.newChordCanvas(el,chord);
                        el.appendChild(canvas);
                }  else {
                        ChordialJS.clearCanvas(canvas);
                }
                var ctx= canvas.getContext('2d');
                if(!chord.parsed.positions.error) {
                    console.log("Parsed chord OK");
                    ChordialJS.render.drawBox(ctx, chord);
                    ChordialJS.render.drawPositions(ctx, chord);
                    ChordialJS.render.drawBarres(ctx, chord);
                    ChordialJS.render.drawFingers(ctx, chord);
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
   'diminished' : {
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
    },
    'sus2' : {
	'A'	: [['2400','24--']],
	'A#'	: [['3011','3-11']],
	'B'	: [['4122','3122']],
	'C'	: [['0233','-233']],
	'C#'	: [['1344','1233']],
	'D'	: [['X200','-2--']],
	'D#'	: [['X311','-211']],
	'E'	: [['X422','-211']],
	'F'	: [['0033','--33']],
	'F#'	: [['X644','-211']],
	'G'	: [['0230','-12-']],
	'G#'	: [['1341','1231']]
    },
    'sus4' : {
	'A'	: [['2200','22--']],
	'A#'	: [['3311','2311']],
	'B'	: [['4402','2301']],
	'C'	: [['5533','2311']],
	'C#'	: [['6644','2311']],
	'D'	: [['X230','-23-']],
	'D#'	: [['8866','2311']],
	'E'	: [['9977','2311']],
	'F'	: [['XX11','--11']],
	'F#'	: [['XX22','--22']],
	'G'	: [['0033','--33']],
	'G#'	: [['11XX','11--']]
    },
    'diminished' : {
	'A'	: [['X986','-321']],
	'A#'	: [['3404','12-3']],
	'B'	: [['XBA8','-321']],
	'C'	: [['XCB9','-321']],
	'C#'	: [['XDEA','-321']],
	'D'	: [['XXAB','--12']],
	'D#'	: [['X320','-21-']],
	'E'	: [['X431','-321']],
	'F'	: [['X542','-321']],
	'F#'	: [['X653','-321']],
	'G'	: [['0131','-131']],
	'G#'	: [['X875','-321']]
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
 'scales' : {
	'intervals' : {
		'major' : [2,2,1,2,2,2,1],
		'minor' : [2,1,2,2,2,1,2]
	},
	'chordtypes' : {
		'major' : ['major','minor',     'minor','major','major','minor','diminished'],
		'minor' : ['minor','diminished','major','minor','minor','major','major'] //natural
	}
 },
 'notes' : ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
  'chordTypes' : {
    'abbreviations' : {
	'major' : '',
	'minor' : '_m',
	'seven' : '_7',
	'diminished' : '_o',
	'sus2' : '_sus2',
	'sus4' : '_sus4'
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
   'diminished' : {
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
    },
    'sus2' : {
	'A'	: [['2400','24--']],
	'A#'	: [['3011','3-11']],
	'B'	: [['4122','3122']],
	'C'	: [['0233','-233']],
	'C#'	: [['1344','1233']],
	'D'	: [['X200','-2--']],
	'D#'	: [['X311','-211']],
	'E'	: [['X422','-211']],
	'F'	: [['0033','--33']],
	'F#'	: [['X644','-211']],
	'G'	: [['0230','-12-']],
	'G#'	: [['1341','1231']]
    },
    'sus4' : {
	'A'	: [['2200','22--']],
	'A#'	: [['3311','2311']],
	'B'	: [['4402','2301']],
	'C'	: [['5533','2311']],
	'C#'	: [['6644','2311']],
	'D'	: [['X230','-23-']],
	'D#'	: [['8866','2311']],
	'E'	: [['9977','2311']],
	'F'	: [['XX11','--11']],
	'F#'	: [['XX22','--22']],
	'G'	: [['0033','--33']],
	'G#'	: [['11XX','11--']]
    },
    'diminished' : {
	'A'	: [['X986','-321']],
	'A#'	: [['3404','12-3']],
	'B'	: [['XBA8','-321']],
	'C'	: [['XCB9','-321']],
	'C#'	: [['XDEA','-321']],
	'D'	: [['XXAB','--12']],
	'D#'	: [['X320','-21-']],
	'E'	: [['X431','-321']],
	'F'	: [['X542','-321']],
	'F#'	: [['X653','-321']],
	'G'	: [['0131','-131']],
	'G#'	: [['X875','-321']]
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
 'scales' : {
	'intervals' : {
		'major' : [2,2,1,2,2,2,1],
		'minor' : [2,1,2,2,2,1,2]
	},
	'chordtypes' : {
		'major' : ['major','minor',     'minor','major','major','minor','diminished'],
		'minor' : ['minor','diminished','major','minor','minor','major','major'] //natural
	}
 },
 'notes' : ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
  'chordTypes' : {
    'abbreviations' : {
	'major' : '',
	'minor' : '_m',
	'seven' : '_7',
	'diminished' : '_o',
	'sus2' : '_sus2',
	'sus4' : '_sus4'
   }
  }
};

