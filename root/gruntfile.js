module.exports = function(grunt){
    require('load-grunt-tasks')(grunt);

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
                src: 'src/**/*.js',
                dest: 'dist/pages/api/documentation.md'
            },
            wiki: {
                src: 'src/**/*.js',
                dest: 'dist/wiki/api/documentation.md'
            }
        }
    });

    grunt.registerTask('doc', ['jsdoc2md']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('default', ['lint','doc']);
    grunt.registerTask('deploy:pages', ['default','buildcontrol:pages']);
    grunt.registerTask('deploy:wiki', ['default','buildcontrol:wiki']);
};
