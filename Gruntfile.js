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
                    'tabletop/view/scripts/libs/jquery-2.1.3.min.js',

                    'tabletop/view/scripts/libs/angular.js',
                    'tabletop/view/scripts/libs/angular-cookies.js',
                    'tabletop/view/scripts/libs/angular-route.js',
                    'tabletop/view/scripts/libs/angular-sanitize.js',
                    'tabletop/view/scripts/libs/angular-translate.js',
                    'tabletop/view/scripts/libs/angular-translate-loader-static-files.js',
                    'tabletop/view/scripts/libs/ngStorage.js',

                    'tabletop/view/scripts/libs/underscore.js',
                    'tabletop/view/scripts/libs/bootstrap-datepicker.js',
                    'tabletop/view/scripts/libs/JsBarcode.all.min.js',
                    'tabletop/view/scripts/libs/materialize.min.js'
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
                },{
                    src: 'tabletop/view/production/production-html.js',
                    dest: 'tabletop/view/production/production-html.min.js'
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

};