const path = require('path')
const fs = require('fs')
const express = require('express')
const spdy = require('spdy')
const helmet = require('helmet')
const expressStaticGzip = require('express-static-gzip')
const app = express()
const {frontendPort} = require('../config.js')
const bodyParser = require('body-parser')

// Create an HTTP2 compatible server.
// Express currently doesn't support the core HTTP2, but keep an eye on that going forward
const server = spdy.createServer({
    key: fs.readFileSync(path.resolve(__dirname, '../', 'certs/', 'key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../', 'certs/', 'fullchain.pem')),
}, app)

// Apply some useful plugins like helmet (security) and bodyParser (post param decoding)
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Service workers should be loaded from / instead of a directory like /dist/
app.use('/service-worker.js', express.static(path.resolve(__dirname, '../public/dist/service-worker.js')))

app.use('/', expressStaticGzip(path.resolve(__dirname, '../', 'public'), {
    enableBrotli: true,
    indexFromEmptyFile: false,
}))

// If in development, load resources from HMR server
if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode!')
    let render

    require('./hmr.js')(app, (serverBundle, clientManifest, template) => {
        render = require('./ssr_renderer.js')(clientManifest, serverBundle, template)
    })

    app.get('*', (req, res) => {
        if (render) {
            const context = {
                url: req.url,
                meta: {
                    title: 'Default Title',
                },
                fullUrl: 'https://' + req.get('host') + req.originalUrl,
            }

            render(req, res, context)
        } else {
            res.send('Compiling, reload in a moment.')
        }
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

server.listen(frontendPort, (err) => {
    if (err) {
        throw err
    }
    console.log(`Listening on port ${frontendPort}`)
})
