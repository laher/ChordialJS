ChordialJS
==========

Chord chart utility extending the features of ChordJS.

ChordJS draws a guitar chord inside an html5 Canvas, and ChordialJS adds a library of chords, and some other bells and whistles.

Samples
-------
A picture tells a thousand words ...

 - [Common chords](http://laher.github.com/ChordialJS/sample-common-chords.html) - standard guitar tuning.
 - [Lefty chords](http://laher.github.com/ChordialJS/sample-lefty.html) - guitar chords for left-handers.
 - The [I-vi-IV-V progression](http://laher.github.com/ChordialJS/sample-progression1.html) for each key - standard guitar tuning.
 - [Uke chords](http://laher.github.com/ChordialJS/sample-ukelele.html) common chordsfor the tenor ukelele.

Features
-------
### ChordialJS.chords:

ChordialJS comes with a small but growing chord library. 

 - ChordialJS.chordTypes: so far 'major', 'minor' and 'seven' chords included 
 - ChordialJS.tunings: so far, guitar (standard tuning) and ukelele (gCEA).

### ChordialJS.keys, and chord progressions:
 - You can use the ChordialJS.keys data to tabulate chord progressions.
 - Initially just the major keys are available for building chord progressions. 

### Other options:
 - any chord chart can easily be reversed for 'lefties'
 - support for different 'tuning's (currently limited to standard or ukelele).

Usage
-----
For full details, see the [samples](http://laher.github.com/ChordialJS/samples.html) included, but the following snippets should give you an idea.
 1. Include chords.js and Chordial.js in script tags. Chordial.js doesn't need JQuery or any other libraries.

 2. Tabulate a collection of chords. In this case, the major chords for standard guitar tuning:

<code><pre>
   for (var note in ChordialJS.chords.standard.major) {
	ChordialJS.makeChord(document.getElementById('container'),note,{ 'size': 3, 'lefty': false });
   }
</pre></code>

 3. Make a chord progression. In this example I'm creating a I,IV,V progression for each key.

<code><pre>
   for (var note in ChordialJS.keys.major) {
	var ch= ChordialJS.keys.major[note];
	ChordialJS.makeChord(container,ch[0][0],options);
	ChordialJS.makeChord(container,ch[3][0],options);
	ChordialJS.makeChord(container,ch[4][0],options);
   }
</pre></code>

 
