import Vue from "vue";
import Vuex from "vuex";
import axios from "@/plugins/axios";
import router from '@/router'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        auth: {
            access_token: localStorage.getItem('access_token'),
            expired: localStorage.getItem('expired_at'),
            user: {},
        },
        statistic: {},
        losses: {},
        is_dark_theme: !!JSON.parse(localStorage.getItem('is_dark_theme')) === true,
    },
    mutations: {
        setAccessToken: (state, accessToken) => {
            state.auth.access_token = accessToken;
        },
        setExpired: (state, expired) => {
            state.auth.expired = expired;
        },
        setUser: (state, user) => {
            state.auth.user = user;
        },
        setStatistic: (state, payload) => {
            state.statistic = payload;
        },
        setLosses: (state, payload) => {
            state.losses = payload;
        },
        toggleTheme: (state) => {
            const isDarkTheme = state.is_dark_theme;
            state.is_dark_theme = !isDarkTheme;
            localStorage.setItem('is_dark_theme', !isDarkTheme);
        },
        // delete all auth and user information from the state
        clearAuthData: state => {
            state.auth = {};
        }
    },
    actions: {
        login: async ({dispatch}, payload) => {
            return await axios.post('/login', payload).then(response => {
                if (response.status === 200) {
                    dispatch('OnTokenCallback', response)
                    // fix store data refresh
                    window.location.href = '/'
                }
            });
        },
        // eslint-disable-next-line no-unused-vars
        register: async ({dispatch}, payload) => {
            return await axios.post('/register', payload);
        },
        OnTokenCallback: ({commit}, response) => {
            // Save data to store
            const expired = response.data.expires_in;
            const accessToken = response.data.access_token;

            // Save expired_at date
            let expiredAt = new Date();
            expiredAt.setHours(expiredAt.getHours() + Math.floor(expired / 3600))
            localStorage.setItem('expired_at', expiredAt.getTime().toString())
            localStorage.setItem('access_token', accessToken)

            commit("setAccessToken", accessToken);
            commit("setExpired", expiredAt);
        },
        refreshToken: async ({state, dispatch}) => {
            return await axios.post('refresh', {refresh: state.access_token})
                .then(response => {
                    if (response.status === 200) {
                        dispatch('OnTokenCallback', response)
                    }
                });
        },
        fetchUser: async ({commit}) => {
            return await axios.get('/me').then(response => {
                if (response.status === 200) {
                    commit("setUser", response.data.data);
                }
            });
        },
        logout: async ({commit}) => {
            return await axios.get('/logout').then(response => {
                if (response.status === 200) {
                    commit("clearAuthData");
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('expired_at')
                    router.push({name: 'login'})
                }
            })
        },
        // eslint-disable-next-line no-unused-vars
        statistic: async ({commit}, payload) => {
            return await axios.get('/dashboard', {params: payload}).then(response => {
                if (response.status === 200) {
                    commit('setStatistic', response.data.data)
                }
            })
        },

        losses: async ({commit}) => {
            return await axios.get('/dashboard/losses').then(response => {
                if (response.status === 200) {
                    commit('setLosses', response.data)
                }
            })
        },

        toggleTheme: async ({commit}) => {
            commit('toggleTheme')
        },
    },
    modules: {},
    getters: {
        user: state => state.auth.user,
        access_token: state => state.auth.access_token,
        expired: state => state.auth.expired,
        statistic: state => state.statistic,
        losses: state => state.losses,
        is_dark_theme: state => state.is_dark_theme || false,
    }
});
