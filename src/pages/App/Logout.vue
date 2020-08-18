<template>
  <div></div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  created() {
    localStorage.removeItem("token");
    this.setMenu([]);
    this.setUser(null);
    this.$router.push("/login");
  },
  methods: {
    ...mapActions(["setMenu", "setUser"])
  }
};
</script>
