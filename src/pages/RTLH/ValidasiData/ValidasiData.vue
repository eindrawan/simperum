<template>
  <Page title="Validasi Data RTLH" :sidebar="true">
    <template v-slot:toolbar>
      <v-icon @click="doPrint++" v-tooltip="'Download Excel'"
        >mdi-microsoft-excel</v-icon
      >
    </template>
    <Sidebar :value.sync="area" />
    <div style="padding:10px; width:100%;" v-show="area.Kelurahan">
      <DesaGlance
        :dbparams="area"
        @click-tambah-baru="ClickTambahBaru"
        :addNew="true"
      />
      <Grid
        :datagrid.sync="datagrid"
        dbref="PRM.ValidasiData"
        :dbparams="area"
        :disabled="true"
        :doPrint="doPrint"
        height="calc(100vh - 230px)"
        :columns="[
          {
            name: 'NIK',
            value: 'NIK',
            class: 'plain',
            filter: {
              type: 'search'
            }
          },
          {
            name: '',
            value: 'IsValidated',
            class: 'plain center'
          },
          {
            name: 'Nama',
            value: 'KRT_Nama',
            width: '200px',
            class: 'fix-width',
            filter: {
              type: 'search'
            }
          },
          {
            name: 'Alamat',
            value: 'Alamat',
            width: '250px',
            class: 'fix-width',
            filter: {
              type: 'search'
            }
          },
          {
            name: 'Prior',
            value: 'RTLH_Prioritas',
            class: 'center'
          },
          {
            name: 'Skor',
            value: 'ScoreTag'
          },
          {
            name: 'DT',
            value: 'NamaData',
            width: '70px'
          },
          {
            name: 'Intervensi',
            value: 'Intervensi'
          }
        ]"
      >
        <template v-slot:row-NIK="{ row }">
          <v-btn text small color="primary" @click="OpenDetail(row.NoUrutRT)">
            {{ row.NIK || "&lt; kosong &gt;" }}
          </v-btn>
        </template>
        <template v-slot:row-IsValidated="{ row }">
          <v-icon
            v-if="row.IsValidated"
            color="primary"
            v-tooltip="'Sudah Terverifikasi'"
            >mdi-account-check</v-icon
          >
          <v-icon v-if="!row.IsValidated" v-tooltip="'Belum Terverifikasi'"
            >mdi-account-question-outline</v-icon
          >
        </template>
      </Grid>
      <ValidasiDetail
        :show.sync="showDetailModal"
        :noRef="selectedRef"
        :area="area"
      />
    </div>
  </Page>
</template>
<script>
import Sidebar from "./SideBar";
import DesaGlance from "../DesaGlance";
import ValidasiDetail from "../InputUsulan/ValidasiDetail";

export default {
  components: {
    Sidebar,
    DesaGlance,
    ValidasiDetail
  },
  data: () => ({
    datagrid: [],
    area: {},
    showDetailModal: false,
    doPrint: 0,
    selectedRef: null
  }),
  methods: {
    ClickTambahBaru() {
      this.showDetailModal = true;
    },
    OpenDetail(noRef) {
      this.selectedRef = noRef;
      this.showDetailModal = true;
    }
  }
};
</script>
