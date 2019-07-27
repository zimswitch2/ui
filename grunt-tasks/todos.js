module.exports = function (grunt) {
    'use strict';

    var execSync = require('child_process').execSync;

    grunt.registerTask('todo:list', 'List all TODO comments in the code', function () {
        var command = '\\grep -e "// \\?TODO" -r . --exclude-dir=node_modules --exclude-dir=target ' +
            '--exclude-dir=assets --exclude=*.iws --exclude-dir=bower_components -n -C 0';
        console.log('' + execSync(command));
    });

    grunt.registerTask('todo:changes', 'List added and removed TODO comments in the code since specified revision (use --since option)', function () {
        if (!grunt.option('since')) {
            grunt.fail.fatal('Please supply --since=<commit hash> option');
        }

        var commits = execSync('git log -S TODO ' + grunt.option('since') + '..HEAD  --format="%H"');

        commits.toString().trim().split('\n').forEach(function (commitHash) {
            var commit = execSync('git show -U0 --format="%h %an" --no-prefix ' + commitHash).toString();

            var fileDiffs = commit.split(/diff --git /);
            var commitHeader = fileDiffs.shift().trim();

            var todosPerFile = fileDiffs.filter(function(fileDiff) {
               return fileDiff.match(/TODO/i) && fileDiff.match(/\+\+\+ (\S+)/);
            }).map(function(fileDiff) {
                var match = fileDiff.match(/\+\+\+ (\S+)/);
                var fileName = match[1];

                var todos = fileDiff.split('\n').filter(function (line) {
                    return line.match(/TODO/i);
                }).map(function (todoLine) {
                    var todo = todoLine.match(/(\+|\-)(.*TODO.*)/i);
                    var addedOrRemoved = todo[1] === "+" ? 'ADDED' : 'REMOVED';
                    var message = todo[2].trim();

                    return {
                        addedOrRemoved: addedOrRemoved,
                        message: message
                    };
                });

                return {
                    fileName: fileName,
                    todos: todos
                }
            });

            todosPerFile.forEach(function (file) {
                console.log('\n' + file.fileName);
                file.todos.forEach(function (todo) {
                    console.log(commitHeader + '\t\t' + todo.addedOrRemoved + '\t\t' + todo.message);
                });
            })
        });
    });
};
