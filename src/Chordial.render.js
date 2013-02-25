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
	console.log(chord);
	var notes= ChordialJS.chordcalc.calculateNotesOfChord(chord.parsed.positions.chordPositions, chord.tuning, chord.lefty);
	console.log(notes);
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

