// Load all tasks from /gulp
var fs = require('fs');
var path = require('path');
var taskDir = path.join(__dirname, 'gulp');
var tasks = fs.readdirSync(taskDir);

tasks.forEach(function (task) {
    require(path.join(taskDir, task))();
});
