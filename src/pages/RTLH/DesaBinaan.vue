<template>
  <Page title="Desa Binaan">
    <template v-slot:toolbar>
      <v-btn text color="primary" @click="CetakBNBA">
        <v-icon left dense>print</v-icon>
        CETAK BNBA
      </v-btn>
      <v-icon @click="doPrint++">mdi-microsoft-excel</v-icon>
    </template>
    <Grid
      dbref="PRM.DesaBinaan"
      :datagrid.sync="desabinaan"
      :doPrint="doPrint"
      :columns="[
        {
          name: 'OPD',
          value: 'Pendamping',
          width: '200px',
          editable: {
            com: 'Input'
          }
        },
        {
          name: 'Kabupaten',
          value: 'Kabupaten',
          width: '200px',
          editable: {
            com: 'Select',
            dbref: 'Arch.SelArea',
            value: 'KabupatenID',
            dbparams: { ParentAreaID: 33 }
          }
        },
        {
          name: 'Kecamatan',
          value: 'Kecamatan',
          width: '200px',
          editable: {
            com: 'Select',
            dbref: 'Arch.SelArea',
            value: 'KecamatanID',
            dbparams: f => ({ ParentAreaID: f.KabupatenID })
          }
        },
        {
          name: 'Kelurahan',
          value: 'Kelurahan',
          width: '200px',
          editable: {
            com: 'Select',
            dbref: 'Arch.SelArea',
            value: 'AreaID',
            dbparams: f => ({ ParentAreaID: f.KecamatanID })
          }
        }
      ]"
    >
    </Grid>
  </Page>
</template>
<script>
export default {
  data: () => ({
    desabinaan: [],
    doPrint: 0
  }),
  methods: {
    async CetakBNBA() {
      let ret = await this.$api.post("/report/generate/xlsx", {
        sp: "PRM_RptSisaDesaBinaan"
      });
      if (ret.success) this.$api.download(this.$api.url + "/report" + ret.data);
    }
  }
};
</script>
