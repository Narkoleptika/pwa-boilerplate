<template>
    <div>
        Home

        <router-link to="/foo">Foo</router-link>
    </div>
</template>

<script>
export default {
    name: 'home',
    title() {
        return 'Home'
    },
    data() {
        return {
        }
    },
    mounted() {
        setTimeout(() => {
            this.$store.dispatch('showError', 'test')
        }, 1000)
    },
}
</script>

<style lang="less">

</style>