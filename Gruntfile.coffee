module.exports = (grunt) ->
	'use strict'

	require('load-grunt-tasks')(grunt)

	grunt.initConfig
		jsSource: 'src/*.js'
		jsDist: 'dist/'
		banner: '/**\n
 * bem-flash — friendly generator of BEM class names\n
 * @author Alexander Burtsev, http://burtsev.me, <%= grunt.template.today("yyyy") %>\n
 * @license MIT\n
 */\n',

		jshint:
			bemflash: ['<%= jsSource %>']

		copy:
			options:
				process: (content, srcpath)->
					grunt.config.get('banner') + content
			source:
				files: [
					expand: true
					cwd: 'src/'
					src: ['**']
					dest: 'dist/'
				]

		uglify:
			options:
				banner: '<%= banner %>'
				sourceMap: true
			bemflash:
				files:
					'<%= jsDist %>bem-flash.min.js': ['<%= jsSource %>']

		notify:
			build_ready:
				options:
					message: 'Build is ready!'

		watch:
			bemflash:
				files: ['<%= jsSource %>']
				tasks: ['jshint', 'copy', 'uglify', 'notify']

	grunt.registerTask 'default', ['jshint', 'copy', 'uglify', 'watch']
