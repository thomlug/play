import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        user: null,
    },
    getters: {
        user (state) {
            return state.user
        }
    },
    mutations: {
        setUser (state, value) {
          state.user = value;
        },
    },
});