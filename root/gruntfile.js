module.exports = function(grunt){
    require('load-grunt-tasks')(grunt);
    var path = require('path');

    var pkg = grunt.file.readJSON('package.json');

    var modules = function(){
        var result = [];
        var files = grunt.file.expand('src/**/module.js');

        for(var i = 0; i < files.length; i++) {
            var modulePath = path.dirname(files[i]);
            var name = path.basename(modulePath);
            result.push({
                name: name,
                path: modulePath,
                version: pkg.version
            });
        }
        return result;
    };

    var bundle = function(){
        var result = {};
        var mods = modules();

        for(var i = 0; i < mods.length; i++){
            result[mods[i].name] = {
                src: [mods[i].path + '/module.js', mods[i].path + '/**/*.js'],
                dest: 'dist/build/' + mods[i].name + '-' + mods[i].version + '.debug.js'
            };
        }

        return result;
    };

    var uglify = function(){
        var files = grunt.file.expand('dist/build/**/*.debug.js');
        var result = {};

        for(var i = 0; i < files.length; i++) {
            result[files[i].replace('debug.js','min.js')] = [files[i]];
        }

        return result;
    };

    grunt.initConfig({
        pkg: pkg,
        clean: ['dist/build'],
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
                tasks: ['default']
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
        },
        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            default: {
                files: [{
                    expand: true,
                    src: ['src/**/*.js'],
                }]
            }
        },
        concat: bundle(),
        uglify: {
            dist: {
                options: {
                    sourceMap: true
                },
                files: uglify()
            }
        }
    });

    grunt.registerTask('compile',['ngAnnotate','concat','uglify']);
    grunt.registerTask('doc', ['jsdoc2md']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('default', ['clean','lint','doc','compile']);
    grunt.registerTask('deploy:pages', ['default','buildcontrol:pages']);
    grunt.registerTask('deploy:wiki', ['default','buildcontrol:wiki']);
};
