var gulp = require('gulp'),
    url = require('url'),
    browserSync = require('browser-sync'),
    proxy = require('proxy-middleware');

var config = require('./config');

module.exports = function () {
    // Routes to proxy to the backend. Routes ending with a / will setup
    // a redirect so that if accessed without a trailing slash, will
    // redirect. This is required for some endpoints for proxy-middleware
    // to correctly handle them.

    browserSync({
                    open: true,
                    port: config.port,
                    server: {
                        baseDir: config.app
                    }
                });

    gulp.start('watch');
};
