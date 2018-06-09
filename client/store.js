import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    showErrorMessage: false,
    errorMessage: '',
}

const mutations = {
    showError(state, message) {
        state.showErrorMessage = true
        state.errorMessage = message
    },
    hideError(state) {
        state.showErrorMessage = false
        state.errorMessage = ''
    },
}

const actions = {
    showError: ({commit}, message) => {
        commit('showError', message)
    },
    dismissError: ({commit}) => {
        commit('hideError')
    }
}

export default () => new Vuex.Store({state, mutations, actions})
