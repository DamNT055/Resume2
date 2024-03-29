const sass = require("node-sass");

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    watch: {
      scss: {
        files: ["src/scss/*.scss"],
        tasks: ["b-css"],
      },
      js: {
        files: ["src/js/*.js"],
        tasks: ["b-js"],
      },
    },
    // ANCHOR - JS
    jshint: {
      options: {
        "-W015": true,
        esversion: 6,
      },
      build: {
        src: ["src/js/*.js"],
      },
    },
    concat: {
      options: {
        process: function (src) {
          return src.replace(/^(export|import).*/gm, "");
        },
      },
      bootstrap: {
        src: ["node_modules/bootstrap/dist/js/bootstrap.js", "src/js/*.js"],
        dest: "src/tmp/all.js",
      },
    },
    babel: {
      options: {
        presets: ["@babel/preset-env"],
      },
      build: {
        options: {
          presets: ["@babel/preset-env"],
        },
        files: {
          "src/tmp/babel.js": "src/tmp/all.js",
        },
      },
    },
    uglify: {
      options: {
        banner:
          '/*! The first line in file \n <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build: {
        files: {
          "src/dist/js/all.min.js": ["src/tmp/babel.js"],
        },
      },
      debug: {
        files: {
          "src/debug/babel_debug.min.js": ["src/js/*.js"],
        },
      },
    },
    clean: {
      build: {
        src: ["src/tmp/*"],
      },
    },
    // ANCHOR - End JS
    // ANCHOR - Css
    sass: {
      options: {
        implementation: sass,
        sourceMap: true,
      },
      build: {
        files: {
          "src/dist/css/all.css": "src/scss/all.scss",
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
          "src/dist/css/all.min.css": "src/dist/css/all.css",
        },
      },
    },
    postcss: {
      options: {
        processors: [require("pixrem")(), require("autoprefixer")({})],
      },
      build: {
        src: "src/dist/css/all.css",
      },
    },
    // ANCHOR - End css
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

  grunt.registerTask("b-sass", ["sass"]);
  grunt.registerTask("b-css", ["sass", "postcss", "cssmin"]);
  grunt.registerTask("b-js", [
    "jshint",
    "concat",
    "babel:build",
    "uglify",
    "clean",
  ]);
  grunt.registerTask("runwatch", ["watch"]);
  grunt.registerTask("dev", "Dev run", function () {
    grunt.task.run(["b-css", "b-js"]);
  });
};
