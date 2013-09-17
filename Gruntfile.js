fs = require('fs');
module.exports = function(grunt){
  //grunt plugins
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var config = {
    //stylus css
    stylus: {
      compile: {
        files : {
          'styles/sandlestrap.css' : ['styles/sandlestrap.styl' ],
          'index.css' : ['styles/index.styl']
        }
      }
    },

    // copy: {
    //   main: {
    //     files: [
    //       // {expand: true, flatten: true, cwd :'styles/fonts', src: ['**'], dest: 'rel/styles/fonts'},
    //       // {expand: true, flatten: true, cwd :'styles/img', src: ['**'], dest: 'rel/styles/img'},
    //       {expand: true, flatten: true, cwd :'dependencies', src: ['**'], dest: 'rel/dependencies'},
    //       {expand: true, flatten: true, cwd : 'components', src: ['**/**/dependencies/*.*'], dest: 'rel/dependencies'}
    //     ]
    //   }
    // },

    //minify the JS file to be as small as possible
    uglify: {
      options : {
        //Uncomment the lines below for debug.
        //mangle: false,
        //beautify: true
      },
      app: {
        files : {
          'js/sandlestrap-min.js' : ['js/sandlestrap.js']
        }
      }
    },

    watch: {
      stylus: {
        files: ['styles/*.styl','components/**/*.styl'],
        tasks: ['stylus']
      },
      uglify : {
        files: ['components/**/*.js','!components/**/*-min.js','js/sandlestrap.js'],
        tasks: ['uglify']
      },
      livereload: {
        options: {livereload : true},
        files: ['rel/styles/app.css','index.html','rel/js/sandlestrap-min.js']
      }
    }
  };

  //want to recursivly build the js and styl from the plugins. And did it :) I <3 Grunt and Node <3
  var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
      file = dir + '/' + file;
      var stat = fs.statSync(file);
      if (stat && stat.isDirectory()) results = results.concat(walk(file));
      else results.push(file);
    });
    return results;
  };

  var buildPlugins = function(obj){
    var files = walk('components'),
        getFileName = function(path){
          return path.substring(path.lastIndexOf("/")+1, path.lastIndexOf("."));
        },
        getFilePath = function(path){
          return path.substring(0,path.lastIndexOf("/")+1);
        },
        getParentFolder = function(path){
          path = getFilePath(path).substring(0,path.lastIndexOf('/'));
          return path.substring(path.lastIndexOf("/")+1);          
        };

    files.forEach(function(s){
      var tf = "", fn = getFileName(s), path = getFilePath(s), pf = getParentFolder(s), reg = new RegExp(pf + "\.(js|styl)");
      if(reg.test(s)){
        if(s.match(/\.js$/gi)){
          tf = path + fn + "-min.js";
          config.uglify.app.files[tf] = [s];
          config.watch.livereload.files.push(tf);
        }
        else if(s.match(/\.styl/gi)){
          tf = path + fn + ".css";
          config.stylus.compile.files[tf] = [s];
          config.watch.livereload.files.push(tf);
        }
      }
    });

  };
  buildPlugins();

  //config
  grunt.initConfig(config);

  grunt.registerTask('build', ['stylus', 'uglify']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('default','dev');
};

