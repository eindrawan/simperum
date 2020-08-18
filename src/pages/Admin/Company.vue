<template>
  <Page title="Data Dinas">
    <div class="form-inline padding" style="background:white;">
      <Input label="Nama Dinas" :value.sync="forms.CompanyName" width="300px" />
      <Input label="Deskripsi" :value.sync="forms.Description" width="300px" />
      <TextArea label="Alamat" :value.sync="forms.Address" width="300px" />
      <Input label="Telp." :value.sync="forms.Phone" width="300px" />
      <Input label="Fax." :value.sync="forms.Fax" width="300px" />
      <Input label="Email" :value.sync="forms.Email" width="300px" />
      <br />
      <v-btn @click="Save" color="primary">SIMPAN</v-btn>
    </div>
  </Page>
</template>
<script>
export default {
  data: () => ({
    forms: {}
  }),
  async mounted() {
    this.forms = await this.$api.getOne("Arch.SelCompany");
  },
  methods: {
    Save() {
      this.$api.call("Arch.SavCompany", this.forms);
    }
  }
};
</script>
