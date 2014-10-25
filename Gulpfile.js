var gulp = require("gulp"),
	umd = require("gulp-umd"),
	less = require('gulp-less'),
	sourcemap = require('gulp-sourcemaps'),
	filter = require("gulp-filter"),
	livereload = require("gulp-livereload"),
	httpserver = require("http-server"),
	debug = require('gulp-debug'),
	concat = require('gulp-concat'),
	merge = require('merge-stream'),
	fs = require('fs'),
	path = require("path"),
	rimraf = require("gulp-rimraf");

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}
gulp.task("buildcss", ["cleancss"], function(){
	var folders = getFolders('src/');
	var tasks = folders.map(function(folder) {
		return gulp.src([path.join('src/', folder, "css/index.less"), path.join('src/', folder, "css/*.less")])
				// .pipe(debug({verbose:true}))
				// .pipe(sourcemap.init())
				// .pipe(sourcemap.write("build/js/maps"))
				.pipe(less().on('error', function(err){console.log(err);}))

				.pipe(concat(folder+".css"))
				// .pipe(sourcemap.write("build/css/maps"))
				.pipe(gulp.dest("build"));
	});
	return merge(tasks);
				// .pipe(sourcemap.init())


});

gulp.task("cleanjs", function(){
	return gulp.src('build/*.js', {read: false}).pipe(rimraf());
})

gulp.task("cleancss", function(){
	return gulp.src('build/*.css', {read: false}).pipe(rimraf());
})

gulp.task("buildjs", ["cleanjs"], function(){
	var folders = getFolders('src/');
	var tasks = folders.map(function(folder) {
		try {
			var umdSettingsPath = path.resolve('.','src',folder,"umd.js");
			delete require.cache[umdSettingsPath];
			var umdSettings = require(umdSettingsPath);
		} catch (e){ console.log(e); umdSettings={};}

		return gulp.src([path.join('src/', folder, "js/index.js"), path.join('src/', folder, "js/*.js")])
				// .pipe(debug({verbose:true}))
				// .pipe(sourcemap.init())
				// .pipe(sourcemap.write("build/js/maps"))
				.pipe(concat(folder+".js"))
				.pipe(umd(umdSettings))
				.pipe(gulp.dest("build"));
	});

   return merge(tasks);
});

gulp.task("build", ["buildcss", "buildjs"]);

gulp.task('server', ["build"], function() {
  livereload.listen();
  var HTTPServer = require("http-server").createServer();
  HTTPServer.listen(8080, "0.0.0.0");
  
  return gulp.watch(['src/**', 'test/**'], ["build"]).on('change', livereload.changed);
});



gulp.task('default', function(){

});