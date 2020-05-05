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


mix.options({
    uglify: {
        uglifyOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    }
});

mix.copy('manifest.json', 'dist/manifest.json');
mix.copy('popup.html', 'dist/popup.html');
mix.copy('images', 'dist/images');
mix.copy('node_modules/bootstrap/fonts', 'dist/fonts');

// Background
mix.scripts([
    'background.js'
], 'dist/background.js');


if (mix.inProduction()) {
    // Amazon
    mix.scripts([
        'node_modules/underscore/underscore-min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/autonumeric/autoNumeric-min.js',
        'node_modules/sweetalert2/dist/sweetalert2.all.min.js',
        'node_modules/moment/min/moment-with-locales.min.js',
        'node_modules/bootstrap-notify/bootstrap-notify.min.js',
        'core.js',
        //'amazon.js'
    ], 'dist/pre-amazon.js');

    // Popup
    mix.scripts([
        'popup.js'
    ], 'dist/popup.js');

}else{

    // Amazon
    mix.scripts([
        'node_modules/underscore/underscore-min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/autonumeric/autoNumeric-min.js',
        'node_modules/sweetalert2/dist/sweetalert2.all.min.js',
        'node_modules/moment/min/moment-with-locales.min.js',
        'node_modules/bootstrap-notify/bootstrap-notify.min.js',
        'core.js',
        'amazon.js'
    ], 'dist/amazon.js');

    // Popup
    mix.scripts([
        'popup.js'
    ], 'dist/popup.js');

}



mix.styles([
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/sweetalert2/dist/sweetalert2.min.css',
    'css/loading.css',
    'css/app.css',
], 'dist/core.css');












// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.preact(src, output); <-- Identical to mix.js(), but registers Preact compilation.
// mix.coffee(src, output); <-- Identical to mix.js(), but registers CoffeeScript compilation.
// mix.ts(src, output); <-- TypeScript support. Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.test');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.babelConfig({}); <-- Merge extra Babel configuration (plugins, etc.) with Mix's default.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.dump(); <-- Dump the generated webpack config object to the console.
// mix.extend(name, handler) <-- Extend Mix's API with your own components.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   terser: {}, // Terser-specific options. https://github.com/webpack-contrib/terser-webpack-plugin#options
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
