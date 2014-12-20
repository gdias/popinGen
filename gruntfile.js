module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt, {pattern: 'grunt-contrib-*'});

	// Config & Tasks declarations
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';',
				sourceMap : true
			},
			dist: {
				src: ['src/**/*.js'],
				dest: 'dist/jquery.<%= pkg.name %>.js'
			}
		},
		uglify : {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/jquery.<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		qunit: {
			urls : {
				options : {
					urls : [
						'http://localhost:9000/tests/index.html'
					]
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},
		connect: {
			root_server: {
				options: {
					port: 9000
				}
			},
			test_server: {
				options: {
					port: 9001,
					base: 'tests/',
					hostname: 'localhost',
					open:true
				}
			}
		},
		markdown: {
	    	all: {
	        	files: [{
	          		expand: true,
	          		src: './*.md',
	          		dest: './',
	          		ext: '.html'
	        	}]
	      	}
	    },
		watch: {
			files: ['<%= jshint.files %>','tests/*.js', 'tests/*.html' ],
			tasks: ['connect','jshint', 'qunit', 'concat', 'uglify']
		}
	});
	
	grunt.loadNpmTasks('grunt-markdown');

	grunt.registerTask('mark', ['markdown:all']);
	grunt.registerTask('test', ['connect', 'jshint', 'qunit']);
	grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};