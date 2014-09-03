module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\n',
                stripBanners: true,
                banner: '// <%= pkg.name %> <%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license\n'
            },
            dist: {
                src: [
                    // pre-library
                    'build/fragments/extern-pre.js',
                    'build/fragments/amd-pre.js',



                    'src/namespace.js',
                    'src/version.js',
                    'src/polyfills.js',
                    'src/module-scope.js',

                    // IOC CONTAINER
                    'src/container.js',

                    //UTILITIES
                    // - formatting
                    'src/utilities/formatting.js',
                    'src/utilities/formatting-date.js',

                    // - mapping
                    'src/utilities/mapping.js',

                    // - validation
                    'src/utilities/validation.js',

                    //models + services + resources
                    'src/module.js',

                    //services
                    'src/services/http.js',
                    'src/services/deferred.js',
                    'src/services/async.js',
                    'src/services/localStorage.js',
                    'src/services/bind.js',

                    //knockout extensions
                    'src/observableArray-extensions/ofType.js',



                    'build/fragments/amd-post.js',
                    'build/fragments/extern-post.js',
                ],
                dest: 'build/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                stripBanners: true,
                banner: '// <%= pkg.name %> <%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        watch: {
            scripts: {
                files: ['src/*.*'],
                tasks: ['default'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'watch']);

};