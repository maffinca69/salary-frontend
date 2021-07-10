import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
// import i18n from "./i18n";
import vuetify from "./plugins/vuetify";

// import "./plugins/i18n";

Vue.config.productionTip = false;

new Vue({
  store,
  // i18n,
  vuetify,
  router,
  template: '<App/>',
  render: (h) => h(App),
}).$mount("#app");
