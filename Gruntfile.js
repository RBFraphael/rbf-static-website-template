const sass = require('node-sass');
const webpackConfig = require("./webpack.js");

module.exports = function(grunt)
{
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-run');

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        webpack: {
            default: webpackConfig,
        },
        concat: {
            dev: {
                src: ['src/js/addons/scripts/**/*.js', 'cache/release.js'],
                dest: 'assets/js/release.min.js'
            },
            dist: {
                src: ['src/js/addons/scripts/**/*.js', 'cache/release.js'],
                dest: 'cache/release.bundle.js'
            },
        },
        sass: {
            options: {
                implementation: sass,
                sourceMap: false,
            },
            dist: {
                files: {
                    'cache/release.css': 'src/scss/website.scss'
                }
            },
            dev: {
                files: {
                    'assets/css/release.min.css': 'src/scss/website.scss'
                }
            }
        },
        uglify: {
            options: {
                compress: true,
                sourceMap: true
            },
            dist: {
                files: {
                    'assets/js/release.min.js': 'cache/release.bundle.js'
                }
            }
        },
        cssmin: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: {
                    'assets/css/release.min.css': 'cache/release.css'
                }
            }
        },
        run: {
            buildhtml: {
                cmd: "node",
                args: [
                    "build/buildHtml.js"
                ]
            }
        },
        clean: {
            cache: ['cache'],
            'prod-css': ['assets/css'],
            'prod-js': ['assets/js'],
        },
        watch: {
            scripts: {
                files: 'src/js/**/*.js',
                tasks: ['clean:prod-js', 'webpack', 'concat:dev']
            },
            styles: {
                files: 'src/scss/**/*.scss',
                tasks: ['clean:prod-css', 'sass:dev']
            },
            pages: {
                files: 'src/views/**/*.php',
                tasks: ['run:buildhtml']
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            watch: ['watch:scripts', 'watch:styles', 'watch:pages'],
        }
    });

    grunt.registerTask('dev', ['clean:prod-css', 'clean:prod-js', 'webpack', 'concat:dev', 'sass:dev', 'run:buildhtml', 'concurrent:watch']);
    grunt.registerTask('dist', ['clean:prod-css', 'clean:prod-js', 'webpack', 'concat:dist', 'sass:dist', 'uglify:dist', 'cssmin:dist', 'run:buildhtml', 'clean:cache']);
}