'use strict';

// Basic template description.
exports.description = 'Personalized grunt-init template for EvilDev';

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
'install_. After that, you may execute project tasks with _grunt_. For ' +
'more information about installing and configuring Grunt, please see ' +
'the Getting Started guide:' +
'\n\n' +
'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

    init.process({type: 'grunt'}, [
    // Prompt for these values.
    init.prompt('name'),
    init.prompt('description', 'The best Grunt plugin ever.'),
    init.prompt('version','0.1.0'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('licenses','ISC'),
    init.prompt('author_name','Mitchell Lee'),
    init.prompt('author_email','mitch@evildev.net'),
    init.prompt('author_url','http://blog.evildev.net'),
    ], function(err, props) {

        props.repository = 'git@github.com:TheEvilDev/' + props.name + '.git';
        props.wiki = 'git@github.com:TheEvilDev/' + props.name + '.wiki.git'
        props.npm_test = 'grunt test';
        props.devDependencies = {
            "grunt": "~0.4.5",
            "grunt-build-control": "^0.2.2",
            "grunt-contrib-clean": "^0.6.0",
            "grunt-contrib-concat": "^0.5.0",
            "grunt-contrib-jshint": "^0.10.0",
            "grunt-contrib-uglify": "^0.7.0",
            "grunt-contrib-watch": "^0.6.1",
            "grunt-jsdoc-to-markdown": "^0.4.2",
            "grunt-karma": "^0.10.1",
            "grunt-ng-annotate": "^0.9.2",
            "jasmine-core": "^2.1.3",
            "karma": "^0.12.31",
            "karma-chrome-launcher": "^0.1.7",
            "karma-detect-browsers": "^1.0.0",
            "karma-firefox-launcher": "^0.1.4",
            "karma-ie-launcher": "^0.1.5",
            "karma-jasmine": "^0.3.5",
            "karma-opera-launcher": "^0.1.0",
            "karma-safari-launcher": "^0.1.1",
            "load-grunt-tasks": "^2.0.0",
        };

        // Files to copy (and process).
        var files = init.filesToCopy(props);

        init.copy('gitignore','.gitignore');

        // Add properly-named license files.
        init.addLicenseFiles(files, props.licenses);

        // Actually copy (and process) files.
        init.copyAndProcess(files, props);

        // Generate package.json file.
        init.writePackageJSON('package.json', props);

        // All done!
        done();
    });

};
