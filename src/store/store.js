import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        user: null,
    },
    getters: {
        user: state => state.user
    },
    mutations: {
        setUser(state, value) {
            state.user = value;
        },
    },
    actions: {
        userSignUp({ commit }, payload) {
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    commit('setUser', firebaseUser);
                })
        },

        userSignIn({ commit }, payload) {
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    commit('setUser', firebaseUser);
                })
        },
        autoSignIn({ commit }, user) {
            commit('setUser', user || false);
        },
        userSignOut({ commit }) {
            firebase.auth().signOut();            
            localStorage.removeItem('firebase:authUser:AIzaSyAXGFFPs0Hsax2ryPMbuNGj1kj0MiBRnUg:[DEFAULT]');
            commit('setUser', false);
        }
    }

});