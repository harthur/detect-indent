module.exports = function(grunt) {

  grunt.initConfig({
    protractor_webdriver: {
      local: {
          options: {
              path: '',
              command: 'webdriver-manager start',
          },
      },
    },
    
    protractor: {
        e2e: {
            options: {
                configFile: "protractor.conf.js", // Target-specific config file
                keepAlive: false, // If false, the grunt process stops when the test fails.
                noColor: false, // If true, protractor will not use colors in its output.
                args: {} // Target-specific arguments
            }
        },
    }
  });
  
  grunt.loadNpmTasks('grunt-protractor-webdriver');
  grunt.loadNpmTasks('grunt-protractor-runner');
  
  
  
  grunt.registerTask('test', function(target) {
    return grunt.task.run([
        /* spin your server app before launching webdriver */
        'protractor_webdriver:local',
        'protractor:e2e'
    ]);
  });

};