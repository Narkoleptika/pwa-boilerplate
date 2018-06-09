<template>
    <div>
        Home

        <div class="foo">
            Bar
        </div>

        <router-link to="/foo">Foo</router-link>
    </div>
</template>

<script>
export default {
    name: 'home',
    meta() {
        return {
            title: 'My Site Name | A nice tagline for this site',
            useWholeTitle: true,
            description: 'A nice breif site description',
        }
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
@import '../styles/mixins.less';

.foo {
    color: blue;

    .desktop({
        color: red;
    });

    .mobile({
        background-color: #f00;
    });
}

</style>