<template>
  <Page title="Database RTLH">
    <template v-slot:toolbar>
      <v-icon @click="showCariNIK = true">mdi-account-search</v-icon>
      <v-icon @click="showMap = !showMap">mdi-map-search</v-icon>
      <v-icon @click="doPrint++">print</v-icon>
    </template>
    <Grid
      :datagrid.sync="backlog"
      dbref="PRM.PBDT"
      :dbparams.sync="filters"
      class="dense"
      :preHead="true"
      :disabled="true"
      :height="'calc(100vh - 110px)'"
      @filterChange="filterChange"
      v-show="!showMap"
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
          name: '',
          value: 'VerStatsID',
          class: 'plain center'
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
          name: '',
          value: 'GeoLoc',
          class: 'plain center'
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
          name: 'DT',
          value: 'NamaData',
          filter: {
            type: 'select',
            value: 'TipeData',
            text: 'NamaTipeData',
            dbref: 'PRM.SelTipeData'
          }
        },
        {
          name: 'Intervensi',
          value: 'Remarks',
          filter: {
            type: 'select',
            value: 'Sumber',
            text: 'SumberDana',
            dbref: 'PRM.SelSumber'
          }
        }
      ]"
      :doPrint="doPrint"
      @onPrint="Print"
    >
      <template v-slot:pre-head>
        <Panel
          dbref="PRM.SelDescPBDT"
          :dbparams="{ ...filters, ...gridFilter }"
        >
          <template v-slot="{ first }">
            <div style="display:flex;" class="pre-head">
              <div style="padding: 8px 12px; flex:2; font-size: 14px;">
                <Input
                  rightIcon="search"
                  width="230px"
                  placeholder="Cari NIK/Nama .."
                  :value.sync="filters.Keyword"
                />
                <!-- <v-btn @click="showFilters = true">
                  <v-icon left>mdi-table-search</v-icon>
                  Pencarian
                </v-btn> -->
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
        <v-btn text small color="primary" @click="OpenDetail(row.NoUrutRT)">
          {{ row.NIK || "&lt; kosong &gt;" }}
        </v-btn>
      </template>
      <template v-slot:row-VerStatsID="{ row }">
        <v-icon
          v-if="row.VerStatsID >= 6"
          color="primary"
          v-tooltip="'Sudah Terverifikasi'"
          >mdi-account-check</v-icon
        >
        <v-icon v-if="row.VerStatsID < 6" v-tooltip="'Belum Terverifikasi'"
          >mdi-account-question-outline</v-icon
        >
      </template>
      <template v-slot:row-GeoLoc="{ row }">
        <v-icon
          v-tooltip="'Lihat Lokasi pada Peta'"
          @click="OpenMap(row.NoUrutRT)"
          >mdi-map-marker-radius</v-icon
        >
      </template>
    </Grid>
    <DBMap
      v-show="showMap"
      dbref="PRM.SelPBDTMap"
      :noRef="selectedRef"
      :dbparams="filters"
    />
    <ValidasiDetail
      :show.sync="showDetailModal"
      :noRef="selectedRef"
      :disabled="true"
    />
    <Modal
      title="CARI BERDASARKAN NIK"
      :show="showCariNIK"
      @onCancel="showCariNIK = false"
      @onSubmit="CariMultipleNIK"
      submitText="CARI & DOWNLOAD"
    >
      <TextArea
        label="Masukkan beberapa NIK:"
        width="400px"
        style="height:220px;"
        :value.sync="multipleNIK"
      />
    </Modal>
    <Modal
      title="FILTERS"
      :show="showFilters"
      @onCancel="showFilters = false"
      @onSubmit="ApplyFilters"
      submitText="TERAPKAN"
    >
      <AdvancedFilters :filters="filters" />
    </Modal>
  </Page>
</template>
<script>
import ReportViewer from "../../../components/ReportViewer";
import ValidasiDetail from "../InputUsulan/ValidasiDetail";
import AdvancedFilters from "./AdvancedFilters";
import DBMap from "./Map";
export default {
  components: {
    ValidasiDetail,
    ReportViewer,
    DBMap,
    AdvancedFilters
  },
  data: () => ({
    showDetailModal: false,
    showMap: false,
    filters: {},
    showFilters: false,
    selectedRef: null,
    lat: null,
    lon: null,
    backlog: [],
    reportUrl: null,
    showCariNIK: false,
    doPrint: 0,
    reportOptions: {},
    multipleNIK: null,
    gridFilter: {}
  }),
  async mounted() {},
  // watch: {
  //   filters(val) {
  //     console.log(val);
  //   }
  // },
  methods: {
    OpenDetail(noRef) {
      this.selectedRef = noRef;
      this.showDetailModal = true;
    },
    OpenMap(noRef) {
      this.selectedRef = noRef;
      this.showMap = true;
    },
    Print(headers, data) {
      this.reportOptions = {
        headers: headers,
        data: data
      };
      this.showReport = true;
    },
    filterChange(f) {
      this.gridFilter = f;
    },
    async CariMultipleNIK() {
      let niks = this.multipleNIK
        .split("\n")
        .filter(d => {
          return d;
        })
        .join(",");
      let ret = await this.$api.post(
        "/report/generate/xlsx?sp=PRM_RptSearchByNIK&rptname=CariNIK",
        {
          NIKS: niks
        }
      );
      if (ret.success) this.$api.download(ret.data);
    },
    async ApplyFilters() {}
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
