<template>
  <Page title="Database Backlog">
    <template v-slot:toolbar>
      <v-icon @click="doPrint++">print</v-icon>
    </template>
    <Grid
      :datagrid.sync="backlog"
      dbref="BLG.Database"
      :dbparams="filters"
      :disabled="true"
      :height="'calc(100vh - 120px)'"
      :columns="[
        {
          name: 'NIK',
          value: 'NIK',
          class: 'plain',
          filter: {
            type: 'search',
            value: 'Keyword'
          }
        },
        {
          name: 'Nama',
          value: 'KRT_Nama',
          width: '200px',
          class: 'fix-width',
          filter: {
            type: 'search',
            value: 'Keyword'
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
          name: 'Kabupaten',
          value: 'Kabupaten',
          filter: {
            type: 'select',
            value: 'KabupatenID',
            text: 'Kabupaten',
            dbref: 'Arch.SelArea',
            dbparams: { ParentAreaID: 33 }
          }
        },
        {
          name: 'Kecamatan',
          value: 'Kecamatan',
          filter: {
            type: 'select',
            value: 'KecamatanID',
            text: 'Kecamatan',
            dbref: 'Arch.SelArea',
            dbparams: f => ({ ParentAreaID: f.KabupatenID })
          }
        },
        {
          name: 'Kelurahan',
          value: 'Kelurahan',
          filter: {
            type: 'select',
            value: 'KelurahanID',
            text: 'Kelurahan',
            dbref: 'Arch.SelArea',
            dbparams: f => ({ ParentAreaID: f.KecamatanID })
          }
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
      :doPrint="doPrint"
      @onPrint="Print"
    >
      <template v-slot:pre-head>
        <Panel dbref="BLG.SelDescDatabase" :dbparams="filters">
          <template v-slot="{ first }">
            <div style="display:flex;" class="pre-head">
              <div style="padding: 8px 12px; flex:2; font-size: 14px;">
                <Input
                  rightIcon="search"
                  width="230px"
                  placeholder="Cari NIK/Nama .."
                  :value.sync="filters.Keyword"
                />
              </div>
              <div class="table-desc" style="">
                <div style="background-color:#95a5a6;">
                  Total: {{ first.Total | format }}
                </div>
                <div style="background-color:#2ecc71;">
                  Intervensi {{ first.Intervensi | format }}
                </div>
                <div style="background-color:#ecf0f1; color:gray;">
                  Sisa: {{ first.Sisa | format }}
                </div>
              </div>
            </div>
          </template>
        </Panel>
      </template>
      <template v-slot:row-NIK="{ row }">
        <v-btn text small color="primary" @click="OpenDetail(row.NoRef)">
          {{ row.NIK || "&lt; kosong &gt;" }}
        </v-btn>
      </template>
    </Grid>
    <ValidasiDetail
      :show.sync="showDetailModal"
      :noRef="selectedRef"
      :disabled="true"
    />
    <ReportViewer :options="reportOptions" :show.sync="showReport" />
  </Page>
</template>
<script>
import ReportViewer from "../../components/ReportViewer";
import ValidasiDetail from "./ValidasiData/ValidasiDetail";
export default {
  components: {
    ValidasiDetail,
    ReportViewer
  },
  data: () => ({
    showDetailModal: false,
    filters: {},
    selectedRef: null,
    backlog: [],
    reportUrl: null,
    showReport: false,
    doPrint: 0,
    reportOptions: {}
  }),
  async mounted() {},
  methods: {
    OpenDetail(noRef) {
      this.selectedRef = noRef;
      this.showDetailModal = true;
    },
    Print(headers, data) {
      this.reportOptions = {
        headers: headers,
        data: data
      };
      this.showReport = true;
    }
  }
};
</script>
<style lang="scss">
.table-desc {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;

  div {
    padding: 3px 5px;
    margin-left: 3px;
    color: white;
  }
}
</style>
