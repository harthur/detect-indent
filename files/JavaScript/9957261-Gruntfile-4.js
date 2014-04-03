module.exports = function(grunt) {

    var path = require("path");

    grunt.loadNpmTasks("grunt-contrib-sass");

    grunt.initConfig({
        sass: {
            bundles: {
                options: {
                    quiet: true
                },
                files: [{
                    expand: true,
                    cwd: "src",
                    src: ["*/*/Resources/assets/scss/*.scss"],
                    dest: "public/css",
                    ext: ".css",
                    rename: function (dest, matchedSrcPath, options)
                    {
                        var fileName = path.basename(matchedSrcPath);
                        var filePath = matchedSrcPath.replace(/Resources\/.*$/, "Resources/") + dest.replace(/\/*$/, "") + "/";

                        return filePath + fileName;
                    }
                }]
            }
        }
    });

    grunt.registerTask("default", ["sass"]);
};