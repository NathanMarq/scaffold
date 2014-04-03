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
        ngmin: {
            externalScripts: {
                files: {
                    "grunt_tmp/externalScripts.js" : externalScriptFiles
                }
            },
            mainScript: {
                files: {
                    "grunt_tmp/main.js": "public_src/scripts/main.js"
                }
            },
            controllers: {
                files: {
                    "grunt_tmp/controllers.js": "public_src/scripts/controllers/**/*.js"
                }
            },
            services: {
                files: {
                    "grunt_tmp/services.js" : "public_src/scripts/services/**/*.js"
                }
            },
            directives: {
                files: {
                    "grunt_tmp/directives.js" : "public_src/scripts/directives/**/*.js"
                }
            }
        },
        uglify: {
            options: {
                report: 'min',
                mangle: true,
            },
            externalScripts: {
                files: {
                    "grunt_tmp/externalScripts.min.js" : "grunt_tmp/externalScripts.js"
                }
            },
            mainScript: {
                files: {
                    "grunt_tmp/main.min.js" : "grunt_tmp/main.js"
                }
            },
            controllers: {
                files: {
                    "grunt_tmp/controllers.min.js" : "grunt_tmp/controllers.js"
                }
            },
            services: {
                files: {
                    "grunt_tmp/services.min.js" : "grunt_tmp/services.js"
                }
            },
            directives: {
                files: {
                    "grunt_tmp/directives.min.js" : "grunt_tmp/directives.js"
                }
            }
        },
        concat: {
            dist: {
                files: {
                    'public/scripts/app.js': [
                        'grunt_tmp/externalScripts.min.js',
                        'grunt_tmp/main.min.js',
                        'grunt_tmp/controllers.min.js',
                        'grunt_tmp/services.min.js',
                        'grunt_tmp/directives.min.js'
                    ]
                }
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
                files: ['index.html', 'views/**/*.html'],
            },
            mainScript: {
                files: ['public_src/scripts/main.js'],
                tasks: ['ngmin:mainScript', 'uglify:mainScript', 'concat'],
            },
            controllers: {
                files: ['public_src/scripts/controllers/*.js'],
                tasks: ['ngmin:controllers', 'uglify:controllers', 'concat'],
            },
            services: {
                files: ['public_src/scripts/services/*.js'],
                tasks: ['ngmin:services', 'uglify:services', 'concat'],
            },
            directives: {
                files: ['public_src/scripts/directives/*.js'],
                tasks: ['ngmin:directives', 'uglify:directives', 'concat'],
            }
        },
    });

    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean', 'less', 'ngmin', 'uglify', 'concat']);

};
