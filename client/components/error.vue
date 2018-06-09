<template>
    <div v-if="showErrorMessage" class="error_box">
        <!-- <div class="error_icon"></div> -->
        <div class="error_title">Error!</div>
        <div class="error_message">
            {{ errorMessage }}
        </div>

        <div class="dismiss_button" @click.prevent="dismissError">Dismiss</div>
    </div>
</template>

<script>
export default {
    name: 'errorBox',
    computed: {
        showErrorMessage() {
            return this.$store.state.showErrorMessage
        },
        errorMessage() {
            return this.$store.state.errorMessage
        },
    },
    methods: {
        dismissError() {
            this.$store.dispatch('dismissError')
        }
    }
}
</script>

<style lang="less">

.error_box {
    text-align: center;
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    height: 200px;
    border-radius: 5px;
    padding-top: 15px;
    background-color: #fff;
    box-shadow: 1px 1px 7px 3px #232323;
    z-index: 200;
    overflow: hidden;

    // .error_icon {
    //     background-image: url('/img/error_icon.png');
    //     width: 48px;
    //     height: 48px;
    //     margin: 0px auto;
    // }

    .error_title {
        color: #f65655;
        font-size: 24px;
        margin-top: 5px;
    }

    .error_message {
        color: #555;
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        height: 50%;
        font-size: 20px;
        padding: 10px;
    }

    .dismiss_button {
        background-color: #f65655;
        color: #fff;
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        padding: 8px 0px;
        cursor: pointer;
    }
}
</style>
