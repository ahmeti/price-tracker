let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.copy('manifest.json', 'dist/manifest.json');
mix.copy('popup.html', 'dist/popup.html');
mix.copy('images', 'dist/images');
mix.copy('node_modules/bootstrap/fonts', 'dist/fonts');
mix.copy('alert.mp3', 'dist/alert.mp3');

// Background
mix.scripts([
    'background.js'
], 'dist/background.js');


// Amazon
mix.scripts([
    'node_modules/underscore/underscore-min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/moment/min/moment-with-locales.min.js',
    'node_modules/autonumeric/autoNumeric-min.js',
    'node_modules/sweetalert2/dist/sweetalert2.all.min.js',
    'node_modules/noty/js/noty/packaged/jquery.noty.packaged.min.js',
    'priceTracker.js',
    'priceTrackerAmazon.js'
], 'dist/priceTrackerAmazon.js');


// Popup
mix.scripts([
    'popup.js'
], 'dist/popup.js');


mix.styles([
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/sweetalert2/dist/sweetalert2.min.css',
    'node_modules/noty/lib/noty.css',
    'node_modules/noty/lib/themes/relax.css',
    'css/loading.css',
    'css/app.css',
], 'dist/priceTracker.css');
