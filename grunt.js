var url = require('url');

module.exports = function(grunt) {


  var test_db = grunt.option('test_db') || 'http://localhost:5984/garden-core',
      test_url = test_db + '/_design/garden-core-test/index.html';


  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['garden-core.js']
    },
    mochaTest: {
        quick: ['test/test.js'],
        travis: ['test/install-travis-test.js']
    },
    mochaTestConfig: {
      travis: {
        options: {
          timeout: 10000
        }
      }
    },
    min: {
      dist: {
        src: ['./garden-core.js'],
        dest: './garden-core.min.js'
      }
    },
    concat: {
        dist: {
          src: ['./garden-core.js'],
          dest: 'test/qunit/assets/garden-core.js'
        }
     },
    qunit: {
      all: ['http://localhost:8000/test/qunit/index.html']
    },
    server: {
      port: 8000,
      base: '.'
    }
  });

  // Create a new task.
  grunt.registerTask('kanso', 'kanso push test app', function() {
    var done = this.async();
    grunt.utils.spawn({
      cmd:  'kanso',
      args: ['push', test_db],
      opts: {
        cwd: './test/qunit'
      }
    }, function(err, result, code){
      if (code !== 0) return done('kanso failed');
      done(null);
    });
  });
  grunt.loadNpmTasks('grunt-mocha-test');


  // Default task.
  grunt.registerTask('default', 'lint mochaTest:quick min');
  grunt.registerTask('release', 'lint mochaTest:quick concat kanso qunit min');

};