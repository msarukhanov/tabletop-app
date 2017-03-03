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
                'terminal/view/production/temp/app.js': ['terminal/view/core/app.js'],
                'terminal/view/production/temp/controllers.js': ['terminal/view/modules/*/*.js']
            }
        }
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ngAnnotate: AnnotateOptions,
        concat: {
            dist_libs : {
                src: [
                    'terminal/view/scripts/libs/jquery-2.1.3.min.js',

                    'terminal/view/scripts/libs/angular.js',
                    'terminal/view/scripts/libs/angular-cookies.js',
                    'terminal/view/scripts/libs/angular-route.js',
                    'terminal/view/scripts/libs/angular-sanitize.js',
                    'terminal/view/scripts/libs/angular-translate.js',
                    'terminal/view/scripts/libs/angular-translate-loader-static-files.js',
                    'terminal/view/scripts/libs/ngStorage.js',

                    'terminal/view/scripts/libs/underscore.js',
                    'terminal/view/scripts/libs/bootstrap-datepicker.js',
                    'terminal/view/scripts/libs/JsBarcode.all.min.js',
                    'terminal/view/scripts/libs/materialize.min.js'
                ],
                dest: 'terminal/view/production/production-libs.js'
            },
            dist_terminal: {
                src: [
                    'terminal/view/production/production-libs.js',
                    'terminal/view/production/production-html.js',
                    'terminal/view/production/temp/app.js',
                    'terminal/view/production/temp/controllers.js'
                ],
                dest: 'terminal/view/production/production-js.js'
            }
        },
        htmlConvert: {
            options: {
                // custom options, see below
            },
            templates: {
                src: [
                    'terminal/view/modules/*/*.html'
                ],
                dest: 'terminal/view/production/production-html.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    src: [
                        'terminal/view/styles/*.css'
                    ],
                    dest: 'terminal/view/production/production-css.min.css'
                }]
            }
        },
        uglify: {
            build: {
                files: [{
                    src: 'terminal/view/production/production-js.js',
                    dest: 'terminal/view/production/production-js.min.js'
                },{
                    src: 'terminal/view/production/production-html.js',
                    dest: 'terminal/view/production/production-html.min.js'
                }]

            }
        },
        clean: {
            build: {
                src: ['terminal/view/production/temp']
            }
        },
        watch: {
            scripts: {
                files: ['terminal/view/modules/*/*.js','terminal/view/core/app.js'],
                tasks: ['ngAnnotate', 'htmlConvert', 'concat:dist_libs', 'concat:dist_terminal', 'clean']
            },
            css: {
                files: ['terminal/view/styles/*.css'],
                tasks: ['cssmin']
            },
            another: {
                files: ['terminal/view/modules/*/*.html'],
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

};