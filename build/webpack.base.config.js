const path = require('path')
const webpack = require('webpack')

// Core Deps required for packing
const HTMLPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const MinifyPlugin = require('babel-minify-webpack-plugin')

// Dev tools
const Visualizer = require('webpack-visualizer-plugin')

const isProduction = process.env.NODE_ENV === 'production'

let config = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
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
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {minimize: isProduction, sourceMap: !isProduction},
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [require('autoprefixer')({
                                browsers: ['> 1%', 'last 2 versions'],
                            })],
                        },
                    },
                    'less-loader',
                ],
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
    ],
    optimization: {},
}

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new Visualizer({filename: '../stats.html'}),
        new MinifyPlugin(),
    )
} else {
    config.devtool = 'cheap-module-eval-source-map'
    // config.devtool = 'cheap-eval-source-map'
    // config.devtool = 'eval'
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
}

module.exports = config
