<template>
  <v-app-bar app color="primary" dark dense>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
      />

      <v-menu offset-y v-for="(m, idx) in menu" :key="idx">
        <template v-slot:activator="{ on }">
          <v-btn
            color="white"
            dark
            v-on="on"
            text
            @click="menuClick(m.MenuUrl)"
          >
            {{ m.MenuName }}
          </v-btn>
        </template>
        <v-list v-if="m.submenu.length > 0">
          <v-list-item
            v-for="(item, index) in m.submenu"
            :key="index"
            @click="menuClick(item.MenuUrl)"
          >
            <v-list-item-title>{{ item.MenuName }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-spacer></v-spacer>

    <v-menu offset-y v-if="isLoggedIn">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <span class="mr-2">{{ user.FullName }}</span>
          <v-icon>account_circle</v-icon>
        </v-btn>
      </template>
      <v-list class="contextmenu">
        <v-list-item @click.stop="showChangePassword = true">
          <v-list-item-title>Ganti Password</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logOut">
          <v-list-item-title>Log Out</v-list-item-title>
        </v-list-item>
      </v-list>

      <ChangePassword :show.sync="showChangePassword" />
    </v-menu>
  </v-app-bar>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import ChangePassword from "../Admin/ChangePassword";

export default {
  components: {
    ChangePassword
  },
  data: () => ({
    showChangePassword: false
  }),
  computed: {
    ...mapGetters({
      menu: "getMenu",
      user: "getUser"
    }),
    isLoggedIn() {
      return this.user;
    }
  },
  async created() {
    if (!this.menu || !this.menu.length) {
      var menu = await this.$api.call("Arch_SelMenu");
      this.setMenu(menu);
    }
  },
  methods: {
    ...mapActions(["setMenu", "setUser"]),
    logOut() {
      this.setMenu([]);
      this.setUser(null);
      this.$router.push("/login");
    },
    menuClick(url) {
      console.log(url);
      this.$router.push(url);
    }
  }
};
</script>
