const path = require('path')
const webpack = require('webpack')
const base = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const isProduction = process.env.NODE_ENV === 'production'

const config = Object.assign({}, base, {
    target: 'node',
    entry: './client/server_entry.js',
    output: Object.assign({}, base.output, {
        libraryTarget: 'commonjs2',
    }),
    externals: [
        ...Object.keys(require('../package.json').dependencies),
    ],
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"',
        }),
        new VueSSRServerPlugin(),
    ]),
})

if (!isProduction) {
    console.error('Should be some notify here too')
    config.plugins.push(
        // new ExtractTextPlugin('styles.css'),
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new WebpackBuildNotifierPlugin({
            title: 'Webpack Server Build',
            logo: path.resolve('./img/favicon.png'),
            suppressSuccess: true,
        })
    )
}

console.log(config.entry)

module.exports = config
