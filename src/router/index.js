import Vue from "vue";
import VueRouter from "vue-router";
//import store from "../store/modules/common";
import Home from "../pages/Dashboard/Home.vue";
import Login from "../pages/App/Login";
import Logout from "../pages/App/Logout";
import AdminRoutes from "./administrasi";
import BacklogRoutes from "./backlog";
import RTLHRoutes from "./rtlh";

Vue.use(VueRouter);

const routes = [
  ...AdminRoutes,
  ...RTLHRoutes,
  ...BacklogRoutes,
  {
    path: "/",
    component: Home,
    meta: {
      title: "SIMPERUM"
    }
  },
  {
    path: "/Main/App/Home",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "SIMPERUM", noauth: true }
  },
  {
    path: "/Main/App/Logout",
    name: "Logout",
    component: Logout,
    meta: { noauth: true }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  // console.log(to, from);
  // // return next();
  // if (!to.path.match(/svg/))
  //   return next({
  //     path: to.path,
  //     component: () => import(`../pages/${to.path.replace(/\/Main/, "")}.vue`),
  //   });
  // else return next();

  if (to.meta.noauth) return next();
  else {
    if (localStorage.getItem("token")) {
      next();
      // if (to.path === "/") next();
      // else {
      //   let pages = store.state.user.pages;
      //   if (pages[to.path] && pages[to.path].access) {
      //     store.state.pageId = pages[to.path].id;
      //     return next();
      //   } else {
      //     return next({ path: "/notfound" });
      //   }
      // }
    } else {
      return next({ path: "/login" });
    }
  }
});
const DEFAULT_TITLE = "SIMPERUM";
router.afterEach(to => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;
