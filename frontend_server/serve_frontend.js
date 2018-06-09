const path = require('path')
const fs = require('fs')
const express = require('express')
// const spdy = require('spdy')
const helmet = require('helmet')
const expressStaticGzip = require('express-static-gzip')
const app = express()
const port = 3015
const bodyParser = require('body-parser')

// let server = spdy.createServer({
//     key: fs.readFileSync(path.resolve(__dirname, 'certs/', 'key.pem')),
//     cert: fs.readFileSync(path.resolve(__dirname, 'certs/', 'fullchain.pem')),
// }, app)

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/service-worker.js', express.static(path.resolve(__dirname, '../dist/service-worker.js')))

app.use('/', expressStaticGzip(path.resolve(__dirname, 'dist'), {
    enableBrotli: true,
    indexFromEmptyFile: false,
}))

// If in development, load resources from HMR server
// Run this before express.static
if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode!')

    require('./hmr_server.js')(app, (serverBundle, clientManifest, template) => {
        let render = require('./ssr_renderer.js')(clientManifest, serverBundle, template)

        app.get('*', (req, res) => {
            const context = {
                url: req.url,
                meta: {
                    title: 'Default Title',
                },
                fullUrl: 'https://' + req.get('host') + req.originalUrl,
            }

            render(req, res, context)
        })
    })

} else {
    // If in production, load the client and server files to be served
    console.log('Server is running in production mode')
    const clientManifest = require('../public/dist/vue-ssr-client-manifest.json')
    const serverBundlePath = '../public/dist/vue-ssr-server-bundle.json'
    const template = fs.readFileSync(path.resolve('./public/dist/index.html'), 'utf8')
    let serverBundle = require(serverBundlePath)
    let render = require('./ssr_renderer.js')(clientManifest, serverBundle, template)

    app.get('*', (req, res) => {
        const context = {
            url: req.url,
            meta: {
                title: 'Default Title',
            },
            fullUrl: 'https://' + req.get('host') + req.originalUrl,
        }

        render(req, res, context)
    })
}

app.listen(port, (err) => {
    if (err) {
        throw err
    }
    console.log(`Listening on port ${port}`)
})
