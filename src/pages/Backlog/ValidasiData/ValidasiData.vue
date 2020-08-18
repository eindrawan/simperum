<template>
  <Page title="Validasi Data Backlog" :sidebar="true">
    <Sidebar :value.sync="area" />
    <div style="padding:10px; width:100%;" v-show="area.Kelurahan">
      <DesaGlance :dbparams="area" @clickTambahBaru="ClickTambahBaru" />
      <Grid
        :datagrid.sync="datagrid"
        dbref="BLG.ValidasiData"
        :dbparams="area"
        :disabled="true"
        height="calc(100vh - 210px)"
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
            class: 'fix-width'
          },
          {
            name: 'IDBDT',
            value: 'NoRef'
          },
          {
            name: 'Lahan',
            value: 'StatusTanah'
          },
          {
            name: 'Luas',
            value: 'LuasTanah'
          },
          {
            name: 'DT',
            value: 'NamaData'
          },
          {
            name: 'Intervensi',
            value: 'Intervensi'
          }
        ]"
      >
        <template v-slot:row-NIK="{ row }">
          <v-btn text small color="primary" @click="OpenDetail(row.NoRef)">
            {{ row.NIK || "&lt; kosong &gt;" }}
          </v-btn>
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
import ValidasiDetail from "./ValidasiDetail";

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
