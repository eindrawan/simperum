<template>
  <v-container>
    <div class="login-box">
      <div
        style="height:100px; background:url('/imgs/appex/banner.png'); background-size:cover; background-position:center;"
      ></div>
      <div style="padding:30px;">
        <Input
          label="Username"
          :value.sync="forms.username"
          class="inline"
          left-icon="face"
          width="100%"
        />
        <Input
          label="Password"
          :value.sync="forms.password"
          type="password"
          left-icon="lock"
          width="100%"
        />
        <br />
        <v-btn color="primary" @click="submit" style="width:210px">Login</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    forms: {
      username: "",
      password: ""
    }
  }),
  methods: {
    ...mapActions(["setMenu", "setUser"]),
    async submit() {
      // this.forms.username = "test";
      var ret = await this.$api.login(this.forms);
      if (ret.length) {
        this.setUser(ret[0]);
        var menu = await this.$api.call("Arch_SelMenu");
        this.setMenu(menu);
        this.$router.push({ name: "Home" });
      }
    }
  }
};
</script>
<style lang="scss">
// .theme--light.v-application {
//   background: #f3f3f3;
// }
.login-box {
  width: 300px;
  background: white;
  box-sizing: content-box;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin: auto;
  margin-top: 10%;
  text-align: center;
  overflow: hidden;
}
</style>
