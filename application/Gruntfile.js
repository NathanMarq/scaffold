module.exports = function(grunt) {

    var externalScriptFiles = grunt.file.readJSON('externalScripts.json');

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            compile: {
                options: {
                    cleancss: true
                },
                files: { "public/styles/app.css" : 'public_src/styles/main.less' }
            }
        },
        ngAnnotate: {
            main: {
              files: {
                'grunt_tmp/angularScripts.js' : [
                  'grunt_tmp/scripts/main.js',
                  'grunt_tmp/scripts/controllers/*.js',
                  'grunt_tmp/scripts/factories/*.js',
                  'grunt_tmp/scripts/filters/*.js',
                  'grunt_tmp/scripts/components/*.js',
                  'grunt_tmp/scripts/directives/*.js'
                ]
              }
            }
        },
        uglify: {
            options: {
                report: 'min',
                mangle: true
            },
            main: {
              files: {
                'public/scripts/app.js' : ['public/scripts/app.js']
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
        // use tape to define our tests
        // this is mostly for the back-end code.
        // Front-end code is all handled by testling.
        // Testling settings can be found in the package.json file.
        tape: {
            options: {
              pretty: true,
              output: 'console'
            },
            files: [
                      'tests/routes/**/*.js'
            ]
        },
        eslint: {
            options: {
              quiet: true,
              configFile: '.eslintrc.js'
            },
            server: ['nodeserver/**/*.js'],
            mainScript: ['public_src/scripts/main.js'],
            controllers: ['public_src/scripts/controllers/*.js'],
            factories: ['public_src/scripts/factories/*.js'],
            filters: ['public_src/scripts/filters/*.js'],
            components: ['public_src/scripts/components/*.js'],
            directives: ['public_src/scripts/directives/*.js']
        },
        babel: {
          options: {
            presets: ['es2015']
          },
          main: {
            files: [{
              expand: true,
              cwd: 'public_src',
              src: [
                'scripts/main.js',
                'scripts/controllers/*.js',
                'scripts/factories/*.js',
                'scripts/filters/*.js',
                'scripts/components/*.js',
                'scripts/directives/*.js'
              ],
              dest: 'grunt_tmp',
              ext: '.js'
            }]
          }
        },
        lesslint: {
            options: {
              failOnWarning: false
            },
            src: [
              'public_src/styles/**/*.less', '!public_src/styles/main.less'
            ]
        },
        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            less: {
                files: ['public_src/styles/**/*.less'],
                tasks: ['lesslint', 'less']
            },
            html: {
                files: ['public/index.html', 'public/views/**/*.html']
            },
            server: {
                files: ['nodeserver/**/*.js'],
                tasks: ['eslint:server']
            },
            mainScript: {
                files: ['public_src/scripts/main.js'],
                tasks: ['eslint:mainScript', 'clean', 'concat:libs', 'babel', 'ngAnnotate', 'concat:app', 'testling']
            },
            controllers: {
                files: ['public_src/scripts/controllers/*.js'],
                tasks: ['eslint:controllers', 'clean', 'concat:libs', 'babel', 'ngAnnotate', 'concat:app', 'testling']
            },
            factories: {
                files: ['public_src/scripts/factories/*.js'],
                tasks: ['eslint:factories', 'clean', 'concat:libs', 'babel', 'ngAnnotate', 'concat:app', 'testling']
            },
            filters: {
                files: ['public_src/scripts/filters/*.js'],
                tasks: ['eslint:filters', 'clean', 'concat:libs', 'babel', 'ngAnnotate', 'concat:app', 'testling']
            },
            components: {
                files: ['public_src/scripts/components/*.js'],
                tasks: ['eslint:components', 'clean', 'concat:libs', 'babel', 'ngAnnotate', 'concat:app', 'testling']
            },
            directives: {
                files: ['public_src/scripts/directives/*.js'],
                tasks: ['eslint:directives', 'clean', 'concat:libs', 'babel', 'ngAnnotate', 'concat:app', 'testling']
            },
            externalFiles: {
              files: ['externalScripts.json'],
              tasks: ['clean', 'concat:libs', 'babel', 'ngAnnotate', 'concat:app']
            },
            // watch front-end code:
            ngTests: {
              files: ['tests/public_src/**/*.js'],
              tasks: ['testling']
            },

            // watch back-end code:
            nodeTests: {
                files: ['server.js', 'routes/**/*.js', 'tests/routes/**/*.js'],
                tasks: ['tape']
            }
        }
    });

    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-tape');
    grunt.loadNpmTasks('grunt-testling');
    grunt.loadNpmTasks('grunt-lesslint');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean', 'less', 'concat:libs', 'babel', 'ngAnnotate', 'concat:app', 'uglify']);

};
