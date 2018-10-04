'use strict';

var _ = require('lodash'),
    path = require('path'),
    webpack = require('webpack'),
    project = require('./package.json'),
    mode = process.env.NODE_ENV || 'development',
    banner = _.template(
        '<%= name %> v<%= version %>\n' +
        '<%= description %>\n' +
        '@author <%= author.name %>, <%= author.url %>'
    )(project);

var config = {
    mode,
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    },
    output: {
        library: 'block',
        libraryTarget: 'umd',
        filename: 'index.js',
        path: path.resolve(__dirname, 'lib'),

        // https://github.com/webpack/webpack/issues/6525
        globalObject: 'this'
    }
};

if (process.env.NODE_ENV === 'production') {
    config.plugins = [
        new webpack.BannerPlugin({
            banner
        })
    ];
}

module.exports = config;
