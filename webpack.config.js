'use strict';

var _ = require('lodash'),
    webpack = require('webpack'),
    project = require('./package.json'),
    banner = _.template(
        '<%= name %> v<%= version %>\n' +
        '<%= description %>\n' +
        '@author <%= author.name %>, <%= author.url %>'
    )(project);

var config = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    output: {
        library: 'block',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['', '.js']
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.BannerPlugin(banner)
    ]
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: false
        }
    }));
}

module.exports = config;
