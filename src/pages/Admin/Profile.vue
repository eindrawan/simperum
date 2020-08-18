<template>
  <Page title="Pengguna">
    <div class="form-inline padding" style="background:white;">
      <Input
        label="Password Lama"
        type="password"
        :value.sync="forms.OldPassword"
      />
      <br />
      <Input
        label="Password Baru"
        type="password"
        :value.sync="forms.NewPassword"
      />
      <Input
        label="Ulangi Password"
        type="password"
        :value.sync="forms.RptPassword"
      />
      <v-btn @click="Save" color="primary">SIMPAN</v-btn>
    </div>
  </Page>
</template>
<script>
import crypto from "crypto";
export default {
  data: () => ({
    forms: {}
  }),
  methods: {
    md5(val) {
      return crypto
        .createHash("md5")
        .update(val)
        .digest("hex");
    },
    async Save() {
      await this.$api.call("Arch_SavPassword", this.forms);
    }
  }
};
</script>
<style lang="scss"></style>
