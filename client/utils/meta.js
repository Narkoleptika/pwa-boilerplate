export default (siteName) => {
    /**
     * Get meta from a vue instance
     * @param  {Object} vm  A vue instance (I think)
     * @return {[type]}     I'm not really sure
     */
    function getMeta(vm) {
        const {meta} = vm.$options
        if (meta) {
            return typeof meta === 'function' ? meta.call(vm) : meta
        }
    }

    const serverMetaMixin = {
        created() {
            const componentMeta = getMeta(this)
            if (componentMeta) {
                let meta = {
                    title: siteName,
                    description: '',
                    card: '',
                    robots: '',
                }

                if (componentMeta.title) {
                    if (componentMeta.useWholeTitle) {
                        meta.title = componentMeta.title
                    } else {
                        meta.title = `${componentMeta.title} | ${siteName}`
                    }
                }

                if (componentMeta.description) {
                    meta.description = `<meta name="description" content="${componentMeta.description}">`
                }

                if (componentMeta.noIndex) {
                    meta.robots = '<meta name="robots" content="noindex, nofollow">'
                }

                this.$ssrContext.meta = meta
            }
        },
    }

    const clientMetaMixin = {
        mounted() {
            const componentMeta = getMeta(this)
            if (componentMeta) {
                let title = siteName

                if (componentMeta.title) {
                    if (componentMeta.useWholeTitle) {
                        title = componentMeta.title
                    } else {
                        title = `${componentMeta.title} | ${siteName}`
                    }
                }

                document.title = title
            }
        },
    }

    return process.env.VUE_ENV === 'server' ? serverMetaMixin : clientMetaMixin
}
