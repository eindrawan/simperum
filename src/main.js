import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import api from "./api";
import moment from "moment";
import store from "./store";
import defaultForms from "./plugins/default";
import vuetify from "./plugins/vuetify";
import filters from "./plugins/filters";
import VueToast from "vue-toast-notification";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "vue-toast-notification/dist/theme-sugar.css";
import vClickOutside from "v-click-outside";
import VueNativeSock from "vue-native-websocket";
import VTooltip from "v-tooltip";

// import VueLayers from "vuelayers";
// import "vuelayers/dist/vuelayers.min.css"; // needs css-loader

Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.use(VueToast);
Vue.use(vClickOutside);
Vue.use(VueNativeSock, "ws://localhost:8289");
Vue.use(VTooltip);
// Vue.use(VueLayers);
defaultForms.register();
filters.register();

window.ClientKey =
  moment().format("ddhhmmss") + "X" + parseInt(Math.random() * 100);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
