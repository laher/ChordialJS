/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/** <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\\n' +
        ' <%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> ' + "\\n */"
    // include: '<script type="text/javascript" src="src/<%= pkg.name %>-<%= pkg.version %>.min.js"></script>';
    ,
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },
    qunit: {
      files: ['test/**/*.html']
    },
    'handlebars-static': {
        dev:{
            partials:'app/**/*.hbt', // Wildcard for partials to compile
            files:'app/**/*.hbt', // Wildcard for templates to compile into HTML
            data:'hbr-context/*.json', // Wildcard for default context JSON, will be ignored if inlined
            replaceDir:'app/', // The directory you are reading templates from
            withDir:'site/' // The directory you are publishing to
        }
    },

    concat: {
      options: {
        //banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        files: {
		'dist/<%= pkg.name %>-<%= pkg.version %>.js' : [
			'license.txt',
			'src/<%= pkg.name %>.core.js',
			'src/<%= pkg.name %>.chordcalc.js',
			'src/<%= pkg.name %>.render.js',
			'src/<%= pkg.name %>.data.js'
		//'src/<%= pkg.name %>.data.js'
		]
		/*,
		'index.html' : ['html_parts/header.part.html','html_parts/index.part.html','<file_template:html_parts/footer.part.html>'],
		'samples.html' : ['html_parts/header.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample1.part.html',
                  '<file_template:html_parts/footer.part.html>'],
		'sample2.html' : ['html_parts/header.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample2.part.html',
                  '<file_template:html_parts/footer.part.html>'],
		'sample3.html' : ['html_parts/header.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample3.part.html',
                  '<file_template:html_parts/footer.part.html>'],
		'sample4.html' : [ 'html_parts/header.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample4.part.html',
                  '<file_template:html_parts/footer.part.html>'],
	'dev/index.html': ['html_parts/header.dev.part.html','html_parts/index.part.html','<file_template:html_parts/footer.dev.part.html>'],
	'dev/samples.html': ['html_parts/header.dev.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample1.part.html',
                  '<file_template:html_parts/footer.dev.part.html>'],
	'dev/sample2.html': ['html_parts/header.dev.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample2.part.html',
                  '<file_template:html_parts/footer.dev.part.html>'],
	'dev/sample3.html': ['html_parts/header.dev.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample3.part.html',
                  '<file_template:html_parts/footer.dev.part.html>'],
	'dev/sample4.html': ['html_parts/header.dev.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample4.part.html',
                  '<file_template:html_parts/footer.dev.part.html>']
*/
		  }
	}
    },
      /*
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },*/
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        //src: '<%= concat.dist.dest %>',
        src: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js' //-<%= pkg-version %>.min.js'
      } /*,
      build: {
        src: 'src/<%= pkg.name %>-<%= pkg.version %>.js',
        dest: 'build/ba-<%= pkg.name %>.min.js'
      }*/
    },
    assemble : {
	  options: {
		   partials: [ 'templates/partials/**/*.hbs']
			    //   'src/content/*.hbs']
	  },
	  d: {
	    options: {
	      layout: 'templates/layouts/dev.hbs',
	      dev: true,
	      prod: false
	    },
	    files: [
               { expand: true, cwd: 'templates/pages', src: ['*.hbs', '!indexx.hbs'], dest: 'dev/' }
	    ]
	  },
	  p: {
	    options: {
	      layout: 'templates/layouts/default.hbs',
	      dev: false,
	      prod: true,
              version: '<%= pkg.version %>'
	    },
	    files: [
               { expand: true, cwd: 'templates/pages', src: ['*.hbs', '!indexx.hbs'], dest: './' }
	    ]
	}
     }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('assemble');


  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify', 'assemble']);

};
