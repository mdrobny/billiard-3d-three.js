module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: {
                options: {
                    config: 'tools/compass/config.rb'
                }
            }
        },
        clean: [ "cache/*.*" ],
        watch: {
            options: {
                livereload: true
            },
            scss: {
                files: [ 'css/*.scss' ],
                tasks: [ 'compass' ]
            },
            js: {
                files: [ 'js/**/*.js' ],
                tasks: [ ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask( 'cleanup', [ 'clean' ] );
    grunt.registerTask('build', [ 'compass' ] );
    grunt.registerTask('default', ['watch']);
};