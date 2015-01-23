module.exports = function(grunt){
    require('load-grunt-tasks')(grunt);
    var path = require('path');

    grunt.initConfig({
        buildcontrol: {
            pages: {
                options: {
                    dir: 'dist/pages',
                    commit: true,
                    push: true,
                    remote: '{%= repository %}',
                    branch: 'gh-pages',
                    message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
                }
            },
            wiki: {
                options: {
                    dir: 'dist/wiki',
                    commit: true,
                    push: true,
                    remote: '{%= wiki %}',
                    branch: 'master',
                    message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
                }
            }
        },
        jshint: {
            files: ['gruntfile.js','src/**/*.js']
        },
        watch: {
            scripts: {
                files: '<%= jshint.files %>',
                tasks: ['jshint']
            }
        },
        jsdoc2md: {
            pages: {
                files: grunt.file.expandMapping('src/**/*.js', 'dist/pages/', {
                    rename: function(dest, matchedSrcPath, options){
                        return path.join(dest, matchedSrcPath.replace('.js','.md').replace('src/','api/'));
                    }
                })
            },
            wiki: {
                files: grunt.file.expandMapping('src/**/*.js', 'dist/wiki/', {
                    rename: function(dest, matchedSrcPath, options){
                        return path.join(dest, matchedSrcPath.replace('.js','.md').replace('src/','api/'));
                    }
                })
            }
        }
    });

    grunt.registerTask('doc', ['jsdoc2md']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('default', ['lint','doc']);
    grunt.registerTask('deploy:pages', ['default','buildcontrol:pages']);
    grunt.registerTask('deploy:wiki', ['default','buildcontrol:wiki']);
};
