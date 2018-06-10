const path = require('path')
const webpack = require('webpack')

// Core Deps required for packing
const HTMLPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

// Dev tools
const Visualizer = require('webpack-visualizer-plugin')

const isProduction = process.env.NODE_ENV === 'production'

let config = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        vendor: ['vue', 'vuex', 'vue-router'],
    },
    output: {
        path: path.resolve(__dirname, '../', 'public', 'dist'),
        publicPath: '/dist/',
        filename: '[name]-bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader'],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HTMLPlugin({
            template: 'client/index.template.html',
            inject: false,
            minify: {
                collapseWhitespace: isProduction,
            },
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
    ],
    optimization: {},
}

if (process.env.NODE_ENV === 'production') {
    config.optimization.minimize = true
    config.plugins.push(
        new Visualizer({filename: '../stats.html'}),
    )
} else {
    config.devtool = 'cheap-module-eval-source-map'
    // config.devtool = 'cheap-eval-source-map'
    // config.devtool = 'eval'
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
}

module.exports = config
