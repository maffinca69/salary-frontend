import axios from "axios";
import store from '@/store'

axios.interceptors.request.use(
    config => {
        // Do something before request is sent
        // use getters to retrieve the access token from vuex
        // store
        let token = store.getters.access_token
        if (token !== null) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.defaults.baseURL = process.env.VUE_APP_API_URL

// Handle expire token
axios.interceptors.response.use(response => response, async error => {
        const originalRequest = error.config;
        if (error.response !== undefined && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await store.dispatch("refreshToken");
            return axios(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default axios;
