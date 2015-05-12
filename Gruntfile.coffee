module.exports = (grunt) ->
	'use strict'

	require('load-grunt-tasks')(grunt)

	grunt.initConfig
		jsSource: 'src/*.js'
		jsDist: 'dist/'
		banner: '/**\n
 * bem-cn — friendly BEM class names generator\n
 * @author Alexander Burtsev, http://burtsev.me, <%= grunt.template.today("yyyy") %>\n
 * @license MIT\n
 */\n',

		jshint:
			bemcn: ['<%= jsSource %>']

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
			bemcn:
				files:
					'<%= jsDist %>bem-cn.min.js': ['<%= jsSource %>']

		notify:
			build_ready:
				options:
					message: 'Build is ready!'

		watch:
			bemcn:
				files: ['<%= jsSource %>']
				tasks: ['jshint', 'copy', 'uglify', 'notify']

	grunt.registerTask 'build', ['jshint', 'copy', 'uglify']
	grunt.registerTask 'default', ['build', 'watch']
