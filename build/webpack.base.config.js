const path = require('path')
const webpack = require('webpack')

// Core Deps required for packing
const HTMLPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

// Dev tools
const CleanWebpackPlugin = require('clean-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')

const isProduction = process.env.NODE_ENV === 'production'

let config = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        // app: './client/main.js',
        vendor: ['vue', 'vuex', 'vue-router'],
    },
    output: {
        path: path.resolve(__dirname, '../', 'dist'),
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
                test: /\.less$/,
                use: ['vue-style-loader', 'style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
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
}

if (process.env.NODE_ENV === 'production') {
    config.optimization.minimize = true
    config.plugins.push(
        new Visualizer({filename: '../stats.html'}),
        new CleanWebpackPlugin(['public/dist'], {root: path.resolve('.')}),
    )
} else {
    config.devtool = 'cheap-module-eval-source-map'
    // config.devtool = 'cheap-eval-source-map'
    // config.devtool = 'eval'
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
}

module.exports = config
