const gulp = require('gulp');
const exec = require('child_process').exec;


function core(cb) {
   exec("yarn core build", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

function srv(cb) {
   exec("yarn srv build", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

function api(cb) {
   exec("yarn api build", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

function web(cb) {
   exec("yarn web build", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

exports.default = gulp.series(
  core,
  gulp.parallel(srv,  api),
  web,
)
