ChordialJS
==========

Chord chart utility extending the features of ChordJS.

ChordJS draws a guitar chord inside an html5 Canvas, and ChordialJS adds a library of chords, and some other bells and whistles.

Samples
-------
[Give it a try](http://laher.github.com/ChordialJS/samples.html)

Features
-------
### ChordialJS.chords:

ChordialJS comes with a small but growing chord library. 

 - ChordialJS.chordTypes: so far 'major', 'minor' and 'seven' chords included 
 - ChordialJS.tunings: so far, guitar (standard tuning) and ukelele (gCEA).

### ChordialJS.scales, and chord progressions:
 - You can use the ChordialJS.scales data to tabulate chord progressions.
 - Initially just the major keys are available for building chord progressions. 

### Other options:
 - any chord chart can easily be reversed for 'lefties'
 - support for different 'tuning's (currently limited to standard or ukelele).

Code
----
Fork me on [GitHub](https://www.github.com/laher/ChordialJS/)

For full details, see the [samples](http://laher.github.com/ChordialJS/samples.html) included, but the following snippets should give you an idea.

 1. Include chords.js and Chordial-x.x.x.js (e.g. Chordial-0.0.1.js) in script tags. Chordial.js doesn't need JQuery or any other libraries.

 2. Tabulate a collection of chords. In this case, the major chords for standard guitar tuning:

```html
<script>
   for (var note in ChordialJS.data.chords.standard.major) {
	ChordialJS.makeChord(document.getElementById('container'),note,{ 'size': 3, 'lefty': false });
   }
</script>
```

 3. Make a chord progression. In this example I'm creating a I,IV,V progression for each key.

```html
<script>
   for (var note in ChordialJS.data.scales.major) {
	var ch= ChordialJS.data.scales.major[note];
	ChordialJS.makeChord(container,ch[0][0],options);
	ChordialJS.makeChord(container,ch[3][0],options);
	ChordialJS.makeChord(container,ch[4][0],options);
   }
</script>
```

Build
-----
If you already have [grunt.js](http://gruntjs.com), just type `grunt`.

Grunt can be installed using 'npm' - the [Node.js](http://nodejs.org) package manager.

On Debian Linux, you install `grunt` as follows:

```
 sudo apt-get install npm
 sudo npm install -g grunt
 grunt 
```
