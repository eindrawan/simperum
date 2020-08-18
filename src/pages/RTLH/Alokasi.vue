<template>
  <Page title="Alokasi RTLH">
    <div class="padding">
      <div style="display:flex;">
        <Select
          :value.sync="forms.Sumber"
          dbref="PRM.SelAlokasiSumber"
          style="margin-right:10px;"
          width="100px"
        />
        <Select
          :value.sync="forms.Kabupaten"
          valueKey="txt"
          dbref="PRM.SelPBDTCity"
        />
      </div>
      <Grid
        dbref="PRM.Alokasi"
        :dbparams="params"
        :datagrid.sync="forms.XmlAlokasi"
        :disabled="true"
        height="calc(100vh - 210px)"
        :columns="[
          {
            name: 'Kecamatan',
            value: 'Kecamatan'
          },
          {
            name: 'Kelurahan',
            value: 'Kelurahan'
          },
          {
            name: 'Kuota',
            value: 'Kuota',
            class: 'plain'
          }
        ]"
      >
        <template v-slot:row-Kuota="{ row }">
          <Input type="number" :value.sync="row.Kuota" width="80px" />
        </template>
      </Grid>
      <br />
      <v-btn color="primary" @click="Save">SIMPAN</v-btn>
    </div>
  </Page>
</template>
<script>
export default {
  data: () => ({
    forms: {}
  }),
  computed: {
    params() {
      let { Kabupaten, Sumber } = this.forms;
      return { Kabupaten, Sumber };
    }
  },
  methods: {
    async Save() {
      await this.$api.call("PRM_SavALokasi", { ...this.forms });
    }
  }
};
</script>
<style lang="scss"></style>
