const gulp = require('gulp');
const exec = require('child_process').exec;


function buildCore(cb) {
   exec("yarn core build", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

function buildServer(cb) {
   exec("yarn web build", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

function buildApi(cb) {
   exec("yarn web build", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

function buildWeb(cb) {
   exec("yarn web build", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

exports.default = gulp.series(
  buildCore,
  gulp.parallel(buildWeb,  buildApi, buildServer)
)
