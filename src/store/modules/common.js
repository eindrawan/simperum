import Vue from "vue";

const initialState = () => ({
  notification: {
    message: "",
    type: "success"
  },
  menu: [],
  user: null
});
const state = initialState();

const getters = {
  getNotification: state => state.notification,
  getMenu: state => {
    if (state.menu && state.menu.length) return state.menu;
    else return JSON.parse(localStorage.getItem("menu"));
  },
  getUser: state => {
    if (!state.user) return JSON.parse(localStorage.getItem("user"));
    else return state.user;
  }
};

const actions = {
  setNotification({ commit }, notification) {
    if (typeof notification === "string")
      commit(types.SET_NOTIFICATION, {
        message: notification,
        type: "success"
      });
    else commit(types.SET_NOTIFICATION, notification);
  },
  setMenu({ commit }, data) {
    // if (menu.data) {
    //   var res = [],
    //     mo = {};
    //   menu.data.forEach(m => {
    //     if (m.ParentMenuID === 1) {
    //       if (mo.MenuID) res.push(mo);
    //       mo = m;
    //       mo.submenu = [];
    //     } else {
    //       mo.submenu.push(m);
    //     }
    //   });
    let menu = [];
    if (data.data) {
      let last = null;
      for (let i = 0; i < data.data.length; i++) {
        let m = data.data[i];
        m.child = [];
        if (last && m.ParentMenuID == last.MenuID) {
          last.child.push(m);
        } else {
          menu.push(m);
          last = m;
        }
      }
      commit(types.SET_MENU, menu);
    } else {
      commit(types.SET_MENU, []);
    }
  },
  setUser({ commit }, user) {
    localStorage.setItem("user", JSON.stringify(user));
    commit(types.SET_USER, user);
  }
};

const types = {
  SET_NOTIFICATION: "common/SET_NOTIFICATION",
  SET_MENU: "common/SET_MENU",
  SET_USER: "common/SET_USER"
};

const mutations = {
  [types.SET_NOTIFICATION](state, notification) {
    Vue.set(state, "notification", notification);
  },
  [types.SET_MENU](state, menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
    Vue.set(state, "menu", menu);
  },
  [types.SET_USER](state, user) {
    localStorage.setItem("user", JSON.stringify(user));
    Vue.set(state, "user", user);
  }
};

export default {
  state,
  mutations,
  getters,
  actions,
  types
};
