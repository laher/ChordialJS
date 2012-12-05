/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/** <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' <%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> ' + "\n */"
    // include: '<script type="text/javascript" src="src/<%= pkg.name %>-<%= pkg.version %>.min.js"></script>';
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>',
					'license.txt',
					'<file_strip_banner:src/<%= pkg.name %>.core.js>',
					'<file_strip_banner:src/<%= pkg.name %>.render.js>',
					'<file_strip_banner:src/<%= pkg.name %>.data.js>',
					'src/<%= pkg.name %>.data.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      },
      indexpart: {
	src: ['html_parts/header.part.html','html_parts/index.part.html','<file_template:html_parts/footer.part.html>'],
	dest: 'index.html'
	},
      sample1part: {
	src: ['html_parts/header.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample1.part.html',
                  '<file_template:html_parts/footer.part.html>'],
	dest: 'samples.html'
	},
      sample2part: {
	src: ['html_parts/header.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample2.part.html',
                  '<file_template:html_parts/footer.part.html>'],
	dest: 'sample2.html'
	},
      sample3part: {
	src: ['html_parts/header.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample3.part.html',
                  '<file_template:html_parts/footer.part.html>'],
	dest: 'sample3.html'
	},
      sample4part: {
	src: ['html_parts/header.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample4.part.html',
                  '<file_template:html_parts/footer.part.html>'],
	dest: 'sample4.html'
	},
      indexdev: {
	src: ['html_parts/header.dev.part.html','html_parts/index.part.html','<file_template:html_parts/footer.dev.part.html>'],
	dest: 'dev/index.html'
	},
      sample1dev: {
	src: ['html_parts/header.dev.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample1.part.html',
                  '<file_template:html_parts/footer.dev.part.html>'],
	dest: 'dev/samples.html'
	},
      sample2dev: {
	src: ['html_parts/header.dev.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample2.part.html',
                  '<file_template:html_parts/footer.dev.part.html>'],
	dest: 'dev/sample2.html'
	},
      sample3dev: {
	src: ['html_parts/header.dev.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample3.part.html',
                  '<file_template:html_parts/footer.dev.part.html>'],
	dest: 'dev/sample3.html'
	},
        sample4dev: {
	src: ['html_parts/header.dev.part.html',
                  'html_parts/sampleheader.part.html',
                  'html_parts/sample4.part.html',
                  '<file_template:html_parts/footer.dev.part.html>'],
	dest: 'dev/sample4.html'
	}
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
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
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');

};
