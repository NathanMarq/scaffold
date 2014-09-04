'user strict';

module.exports = function(grunt) {

    var externalStyleFiles = grunt.file.readJSON('externalStyles.json'),
        externalScriptFiles = grunt.file.readJSON('externalScripts.json');

    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            compile: {
                options: {
                    cleancss: true
                },
                files: { "public/styles/app.css" : externalStyleFiles.concat('public_src/styles/main.less') }
            }
        },
        ngAnnotate: {
            main: {
              files: {
                'grunt_tmp/angularScripts.js' : [
                  'public_src/scripts/main.js',
                  'public_src/scripts/controllers/*.js',
                  'public_src/scripts/services/*.js',
                  'public_src/scripts/filters/*.js',
                  'public_src/scripts/directives/*.js'
                ]
              }
            }
        },
        uglify: {
            options: {
                report: 'min',
                mangle: true,
            },
            main: {
              files: {
                'public/scripts/app.js' : ['public/scripts/app.js'],
              }
            }
        },
        concat: {
            libs: {
                src: externalScriptFiles,
                dest: 'grunt_tmp/externalScripts.js',
                nonull: true
            },
            app: {
                src: [
                    'grunt_tmp/externalScripts.js',
                    'grunt_tmp/angularScripts.js'
                ],
                dest: 'public/scripts/app.js',
                nonull: true
            }
        },
        clean: {
            files: ['grunt_tmp/']
        },
        watch: {
            options: {
                livereload: true
            },
            less: {
                files: ['public_src/styles/**/*.less'],
                tasks: ['less']
            },
            html: {
                files: ['public/index.html', 'public/views/**/*.html']
            },
            mainScript: {
                files: ['public_src/scripts/main.js'],
                tasks: ['clean', 'concat:libs', 'ngAnnotate', 'concat:app']
            },
            controllers: {
                files: ['public_src/scripts/controllers/*.js'],
                tasks: ['clean', 'concat:libs', 'ngAnnotate', 'concat:app']
            },
            services: {
                files: ['public_src/scripts/services/*.js'],
                tasks: ['clean', 'concat:libs', 'ngAnnotate', 'concat:app']
            },
            filters: {
                files: ['public_src/scripts/filters/*.js'],
                tasks: ['clean', 'concat:libs', 'ngAnnotate', 'concat:app']
            },
            directives: {
                files: ['public_src/scripts/directives/*.js'],
                tasks: ['clean', 'concat:libs', 'ngAnnotate', 'concat:app']
            }
        },
    });

    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean', 'less', 'concat:libs', 'ngAnnotate', 'concat:app', 'uglify']);

};
