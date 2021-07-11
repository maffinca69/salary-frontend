import Vue from "vue";
import VueRouter from "vue-router";
import AuthLayout from "@/layouts/Auth";
import Login from "@/views/auth/Login";
import store from "@/store";
import DashboardLayout from "../layouts/Dashboard";
import Profile from "../views/profile/Profile";
import Registration from "../views/auth/Registration";

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        redirect: "login",
        component: AuthLayout,
        children: [
            {
                path: "/login",
                name: "login",
                component: Login,
                props: true,
                meta: {
                    authRequired: false
                }
            },
            {
                path: "/registration",
                name: "registration",
                component: Registration,
                meta: {
                    authRequired: false
                }
            },
        ],
    },
    {
        path: '/',
        name: 'home',
        component: DashboardLayout,
        children: [
            {
                path: '/profile',
                name: "profile",
                component: Profile,
            },
        ],
        meta: {
            authRequired: true
        }
    },
];

let router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

const isLoginPage = name => name === 'login'

const currentTime = (new Date()).getTime();

router.beforeEach((to, from, next) => {
    if (!to.meta.authRequired) {
        next()
        return
    }

    const expired = store.getters.expired || 0
    const tokenIsNull = () => !store.getters.access_token
    const tokenExpired = () => !tokenIsNull() && (expired === 0 || parseInt(expired) < currentTime)

    const tokenActive = () => !tokenIsNull() && !tokenExpired()

    console.log(new Date(parseInt(expired)))
    console.log(new Date( currentTime))
    console.log(tokenIsNull())
    console.log(tokenExpired())
    console.log(tokenActive())

    if (tokenIsNull() && !isLoginPage(to.name)) {
        next({name: 'login'})
        return;
    }

    if (isLoginPage(to.name) && tokenActive()) {
        next({name: 'home'})
        return
    }

    if (tokenActive()) {
        console.log('next refresh - ' + new Date(parseInt(expired)))
    }

    if (to.name === from.name) {
        return;
    }

    next()
})

export default router
