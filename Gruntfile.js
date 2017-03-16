/**
 * Created by mmalkav on 23.05.2016.
 */
module.exports = function(grunt) {

    var AnnotateOptions = {
        options: {
            singleQuotes: true
        },
        app: {
            files: {
                'tabletop/view/production/temp/app.js': ['tabletop/view/core/app.js'],
                'tabletop/view/production/temp/controllers.js': ['tabletop/view/modules/*/*.js']
            }
        }
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ngAnnotate: AnnotateOptions,
        concat: {
            dist_libs : {
                src: [
                    'tabletop/view/libs/jquery-2.1.3.min.js',
                    'tabletop/view/libs/angular.js',
                    'tabletop/view/libs/angular-cookies.js',
                    'tabletop/view/libs/angular-route.js',
                    'tabletop/view/libs/angular-translate.js',
                    'tabletop/view/libs/underscore.js',
                    'tabletop/view/libs/materialize.min.js',
                    'tabletop/view/libs/socket.io.js'

                ],
                dest: 'tabletop/view/production/production-libs.js'
            },
            dist_terminal: {
                src: [
                    'tabletop/view/production/production-libs.js',
                    'tabletop/view/production/production-html.js',
                    'tabletop/view/production/temp/app.js',
                    'tabletop/view/production/temp/controllers.js'
                ],
                dest: 'tabletop/view/production/production-js.js'
            }
        },
        htmlConvert: {
            options: {
                // custom options, see below
            },
            templates: {
                src: [
                    'tabletop/view/modules/*/*.html'
                ],
                dest: 'tabletop/view/production/production-html.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    src: [
                        'tabletop/view/styles/*.css'
                    ],
                    dest: 'tabletop/view/production/production-css.min.css'
                }]
            }
        },
        uglify: {
            build: {
                files: [{
                    src: 'tabletop/view/production/production-js.js',
                    dest: 'tabletop/view/production/production-js.min.js'
                }]
            }
        },
        clean: {
            build: {
                src: ['tabletop/view/production/temp']
            }
        },
        watch: {
            scripts: {
                files: ['tabletop/view/modules/*/*.js','tabletop/view/core/app.js'],
                tasks: ['ngAnnotate', 'htmlConvert', 'concat:dist_libs', 'concat:dist_terminal', 'clean']
            },
            css: {
                files: ['tabletop/view/styles/*.css'],
                tasks: ['cssmin']
            },
            another: {
                files: ['tabletop/view/modules/*/*.html'],
                tasks: ['ngAnnotate', 'htmlConvert', 'concat:dist_libs', 'concat:dist_terminal']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html-convert');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //grunt.registerTask('terminal', ['ngAnnotate', 'htmlConvert', 'concat:dist_libs', 'concat:dist_terminal', 'cssmin', 'uglify']);
    //grunt.registerTask('terminal-dev', ['ngAnnotate', 'htmlConvert', 'concat:dist_libs', 'concat:dist_terminal', 'cssmin', 'uglify']);
    grunt.registerTask('libs', ['concat:dist_libs']);
    grunt.registerTask('dev', ['ngAnnotate', 'htmlConvert', 'concat:dist_terminal', 'cssmin', 'clean', 'watch']);
    grunt.registerTask('min', ['uglify', 'cssmin']);
    grunt.registerTask('prod', ['ngAnnotate', 'htmlConvert', 'concat:dist_libs', 'concat:dist_terminal', 'cssmin', 'clean', 'uglify', 'cssmin']);
};