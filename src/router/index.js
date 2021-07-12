import Vue from "vue";
import VueRouter from "vue-router";
import AuthLayout from "@/layouts/Auth";
import Login from "@/views/auth/Login";
import store from "@/store";
import DashboardLayout from "../layouts/Dashboard";
import Profile from "../views/profile/Profile";
import Index from '@/views/dashboard/Index'
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
                    authRequired: false,
                    title: 'Вход'
                }
            },
            {
                path: "/registration",
                name: "registration",
                component: Registration,
                meta: {
                    authRequired: false,
                    title: 'Регистрация'
                }
            },
        ],
    },
    {
        path: '/',
        name: 'home',
        redirect: '/index',
        component: DashboardLayout,
        children: [
            {
                path: 'index',
                name: 'index',
                component: Index,
                meta: {
                    title: 'Главная страница'
                }
            },
            {
                path: '/profile',
                name: "profile",
                component: Profile,
                meta: {
                    title: 'Профиль'
                }
            },
        ],
        meta: {
            authRequired: true,
            title: 'Главная'
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

router.afterEach((to) => {
    if (to.meta.title) {
        Vue.nextTick(() => {
            document.title = to.meta.title;
        })
    }
});

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
