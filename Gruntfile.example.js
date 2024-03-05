const sass = require("node-sass");

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    concat: {
      build: {
        files: {
          "src/tmp/all.js": ["src/js/ab.js", "src/js/resume.js"],
        },
      },
    },
    jshint: {
      options: {
        "-W015": true,
        esversion: 6,
      },
      build: {
        src: ["src/tmp/all.js"],
      },
    },
    babel: {
      options: {
        presets: ["@babel/preset-env"],
      },
      build: {
        files: {
          "src/tmp/all_back.js": "src/tmp/all.js",
        },
      },
    },
    uglify: {
      options: {
        banner:
          '/*! Dòng này chèn vào đầu file <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build: {
        files: {
          "src/build/<%= pkg.name %>.min.js": ["src/tmp/all_back.js"],
        },
      },
      debug: {
        files: {
          "src/debug/<%= pkg.name %>_debug.min.js": [
            "src/js/<%= pkg.name %>.js",
          ],
        },
      },
    },
    clean: {
      build: {
        src: ["src/tmp/*"],
      },
    },
    watch: {
      src: {
        files: ["src/**/*.js"],
        tasks: ["default"],
      },
    },
    sass: {
      options: {
        implementation: sass,
        sourceMap: true,
      },
      build: {
        files: {
          "src/css/all.css": "src/scss/all.scss",
        },
      },
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1,
      },
      build: {
        files: {
          "src/css/all.min.css": "src/css/all.css",
        },
      },
    },
    postcss: {
      options: {
        processors: [require("pixrem")(), require("autoprefixer")({})],
      },
      build: {
        src: "src/css/all.css",
      },
    },
  });
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-postcss");

  grunt.registerTask("default", ["sass", "postcss", "cssmin"]);
  grunt.registerTask("runw", ["watch"]);

  grunt.registerTask("runcss", ["sass"]);
  grunt.registerTask("runjs", [
    "concat:build",
    "jshint:build",
    "babel:build",
    "uglify:build",
    "clean",
  ]);
};
