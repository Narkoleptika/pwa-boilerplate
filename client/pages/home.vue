<template>
    <div>
        <h1>Home</h1>

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
}
</script>

<style lang="less">
@import '../styles/mixins.less';

.foo {
    // color: blue;

    .desktop({
        color: #333333;
    });

    .mobile({
        color: #330000;
    });
}

</style>