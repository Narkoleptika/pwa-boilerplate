import createApp from './create_app.js'

export default (context) => {
    const {app, router, store} = createApp()

    return new Promise((resolve, reject) => {
        router.push(context.url)

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()

            // If the four-oh-four component was matched
            if (matchedComponents.reduce((a, c) => a === true ? a : c.name === 'four-oh-four', false)) {
                if (context.url !== '/404') {
                    return reject({code: 404})
                }
            }

            Promise.all(matchedComponents.map(({asyncData}) => asyncData && asyncData({
                store,
                route: router.currentRoute,
            }))).then(() => {
                context.state = store.state
                // console.log(`Spent ${Date.now() - s}ms getting data before render`)
                resolve(app)
            }).catch(reject)
        }, reject)
    })
}
