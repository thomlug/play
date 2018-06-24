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
            return new Promise((resolve, reject) => {firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .catch(function(error) {
                    reject(error);
                })
                .then(firebaseUser => {
                    commit('setUser', firebaseUser);
                    resolve(firebaseUser);
                })
            })
        },

        userSignIn({ dispatch, commit }, payload) {
            return new Promise((resolve, reject) => {firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if(errorCode === "auth/user-not-found"){
                        error.message = "There is no Play account associated with this email address, please sign up via the link below"
                    }
                    else if(errorCode === "auth/wrong-password"){
                        error.message = "Password incorrect"
                    }
                    reject(error);
                })
                .then(firebaseUser => {
                    commit('setUser', firebaseUser);
                    resolve("Login success");
                })
            });
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