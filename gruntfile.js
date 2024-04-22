
const webpackConfig = require('./webpack.config.js');

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.initConfig({

    clean: ['gen'],

    // compile styles
    sass: {
      dist: {
        options: {
          style: 'compressed' // nested, compact, compressed, expanded.
        },
        files: {
          'gen/alias_winter/assets/css/main.css': 'assets/sass/main.scss' // 'destination': 'source'
        }
      }
    },

    // watch CSS task
    watch: {

      options: {
        dateFormat: function (time) {
          grunt.log.writeln('CSS watch finished in ' + time + 'ms at' + (new Date()).toString());
        },
      },
      scripts: {
        files: ['assets/sass/**/*.scss', 'email/scss/**/*.scss'],
        tasks: ['sass'],
        options: {
          debounceDelay: 3000,
        },
      },
    },
    copy: {
      main: {
        files: [
          // includes files within path
          // {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

          // includes files within path and its sub-directories
          // {expand: true, src: ['path/**'], dest: 'dest/'},

          // makes all src relative to cwd
          // {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

          // flattens results to a single level
          // {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},

          // copy template to index.html
          {
            nonull: true,
            src: 'assets/html/template.html',
            dest: 'gen/alias_winter/index.html',
          },
          { // copy icons
            nonull: false,
            src: 'assets/icon/*',
            dest: 'gen/alias_winter/assets/icon/',
            flatten: true,
            expand: true,
            filter: 'isFile',
          },
          { // copy favicon
            cwd: 'assets/misc',  // set working folder / root to copy
            src: '**/*',           // copy all files and subfolders
            dest: 'gen/alias_winter/assets/misc',    // destination folder
            expand: true           // required when using cwd
          },
          { // copy background imgs
            cwd: 'assets/img',
            src: '**/*',
            dest: 'gen/alias_winter/assets/img/',
            expand: true
          },
          { // copy js framewurxx
            src: 'assets/js/*',
            dest: 'gen/alias_winter/assets/js/',
            flatten: true,
            expand: true,
            filter: 'isFile',
          },
          { // copy web fonts
            src: 'assets/webfonts/*',
            dest: 'gen/alias_winter/assets/webfonts/',
            flatten: true,
            expand: true,
            filter: 'isFile',
          },
          { // copy css
            src: 'assets/css/*',
            dest: 'gen/alias_winter/assets/css/',
            flatten: true,
            expand: true,
            filter: 'isFile',
          }
        ],
      },
    },
    webpack: {
      myConfig: webpackConfig,
    },
  });

  grunt.registerTask('default', ['clean', 'copy:main', 'webpack', 'sass']);

  // CSS dev - watch task
  grunt.registerTask('css', ['watch']);

  grunt.registerTask('mail', ['sass:mail']);
};
