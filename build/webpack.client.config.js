const webpack = require('webpack')
const base = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const isProduction = process.env.NODE_ENV === 'production'

const config = Object.assign({}, base, {
    entry: {
        app: './client/entry_client.js',
        vendor: ['vue', 'vuex', 'vue-router'],
    },
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"',
        }),
        new VueSSRClientPlugin(),
    ]),
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
})

if (isProduction) {
    config.plugins.push(
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$/,
            threshold: 0,
            // minRatio: 0.8,
        }),
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.js$|\.css$/,
            threshold: 0,
            // minRatio: 0.8,
        }),
        new SWPrecacheWebpackPlugin({
            cacheId: 'CHANGEME-app',
            filename: 'service-worker.js',
            // staticFileGlobs: ['dist/**/*.{js,html,css}'],
            // minify: true,
            // stripPrefix: 'dist/',
            runtimeCaching: [{
                urlPattern: '/*',
                handler: 'networkFirst',
            }],
            staticFileGlobs: [
                'dist/**.css',
                'dist/img/**.*',
                'dist/**.js',
            ],
            staticFileGlobsIgnorePatterns: [/google-analytics.com/],
        })
    )
} else {
    // Development mode, so do dev stuff
    config.plugins.push(
        new webpack.NoEmitOnErrorsPlugin(),
        new WebpackBuildNotifierPlugin({
            title: 'Webpack Client Build',
            suppressSuccess: true,
        })
    )
}

module.exports = config
