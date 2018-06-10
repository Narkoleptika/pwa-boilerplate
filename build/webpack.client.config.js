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
    // This automatically takes care of vendor splitting
    config.optimization.splitChunks = {
        cacheGroups: {
            vendor: {
                test: /node_modules/,
                chunks: 'initial',
                name: 'vendor',
                enforce: true,
            },
        },
    }

    // Add Compression plugins and service worker caching
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
            // Don't allow the service worker to try to cache google analytics or your tracking will stop working
            // Disable any other scripts you don't want cached here as well
            staticFileGlobsIgnorePatterns: [/google-analytics.com/],
        })
    )
} else {
    // In development notify if the build fails
    config.plugins.push(
        new WebpackBuildNotifierPlugin({
            title: 'Webpack Client Build',
            suppressSuccess: true,
        })
    )
}

module.exports = config
