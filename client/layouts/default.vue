<template>
    <div class="wrapper default">
        <main>
            <error></error>

            <router-view></router-view>
        </main>
    </div>
</template>

<script>
import error from '../components/error.vue'

export default {
    components: {
        error,
    },
}
</script>