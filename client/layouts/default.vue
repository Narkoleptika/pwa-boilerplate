<template>
    <div class="wrapper default">
        <error></error>

        <router-view></router-view>
    </div>
</template>

<script>
import error from '../components/error.vue'

export default {
    components: {
        error,
    }
}
</script>