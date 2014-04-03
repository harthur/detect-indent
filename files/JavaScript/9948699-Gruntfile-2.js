/*global module:false*/
module.exports = function(grunt) {
  var conf, pkg;

  pkg = grunt.file.readJSON('package.json');
  conf = {
    src: 'app',
    host: '0.0.0.0',
    port: 9000,
    livereload: 35729
  };

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    conf: conf,
    jade: {
      compile: {
        options: {
          banner: 'test',
          pretty: true,
          data: {}
        },
        files: [{
          expand: true,
          cwd: 'app/jade',
          src: ['**/*.jade'],
          dest: 'app',
          ext: '.html'
        }]
      }
    },
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 8888,
          base: 'app',
          open: true,
          livereload: 35729,
          // keepalive: true
        }
      }
    },
    watch: {
      configFiles: {
        files: [ 'Gruntfile.js', 'config/*.js' ],
        options: {
          reload: true
        }
      },   
      jade: {
        files: 'app/jade/*.jade',
        tasks: ['jade'],
        options: {
          livereload: true,
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('connect-reload');

  // Default task.
  grunt.registerTask('build', ['jade']);
  grunt.registerTask('default', ['build', 'connect', 'watch']);
};
