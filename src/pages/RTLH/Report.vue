<template>
  <Page title="Laporan" :sidebar="true">
    <div style="background:white;">
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptRekapGender' })"
          >Rekap Gender</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptUsulanBSPSAll' })"
          >Usulan BSPS</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptUsulanBSPSKLAll' })"
          >Usulan BSPS-KL</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptRekomendasi' })"
          >Rekomendasi Per Tahapan</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptRekomendasi' })"
          >Rekomendasi Semua</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptFreePBDT' })"
          >Desa Bebas PBDT</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptProgressTw' })"
          >Progress Triwulan</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptMonev' })"
          >Progress Monev</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptSisaPBDT' })"
          >BNBA Sisa RTLH per Kabupaten</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="
            Generate($event, {
              sp: 'PRM_RptSisaPBDTMerahBNBA',
              groupsheet: 'Warna'
            })
          "
          >BNBA Sisa RTLH Warna per Kabupaten</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="
            Generate($event, {
              sp: 'PRM_RptSisaDesaBinaan',
              groupsheet: 'Kabupaten'
            })
          "
          >BNBA Sisa RTLH Desa Binaan</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptSisaPBDTWarna2' })"
          >BNBA Sisa RTLH Warna 2015</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptRekapPBDT' })"
          >Rekap Sisa RTLH (Kab/Kota)</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptSisaPBDTKelurahan' })"
          >Rekap Sisa RTLH (Desa)</v-btn
        >
      </div>
      <div class="rowlnk">
        <v-btn
          text
          color="primary"
          @click="Generate($event, { sp: 'PRM_RptSisaPBDTWarna' })"
          >Rekap Sisa RTLH Warna (Desa)</v-btn
        >
      </div>
    </div>
    <div>
      <ReportParams
        v-show="showParams"
        :options="reportOptions"
        :generatedUrl.sync="reportUrl"
      />
      <ReportViewer :url="reportUrl" :show.sync="showReport" />
    </div>
  </Page>
</template>
<script>
import ReportParams from "../../components/Report/Params";
import ReportViewer from "../../components/ReportViewer";

export default {
  components: {
    ReportParams,
    ReportViewer
  },
  data: () => ({
    reportOptions: null,
    reportUrl: "about:blank",
    showReport: false,
    showParams: false
  }),
  watch: {
    reportUrl(val) {
      if (val) this.showReport = true;
    }
  },
  methods: {
    Generate(evt, opts) {
      this.showReport = false;
      this.showParams = true;
      opts.rptname = evt.target.innerText;
      this.reportOptions = opts;
    }
  }
};
</script>
<style lang="scss">
.rowlnk {
  border-bottom: 1px solid #ddd;
}
</style>
