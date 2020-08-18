<template>
  <div>
    <div style="height:calc(100vh - 360px);">
      <BarChart
        :chart-data="datacollection"
        :options="chartOptions"
        class="yearly-chart"
        style="height:100%;"
      ></BarChart>
    </div>
    <div
      id="chart-progress"
      style="width:100%; height:220px; background:white; box-sizing:border-box; padding:15px; box-sizing:border-box; overflow-y: auto; font-size:14px;"
    >
      <div style="font-size:small; margin-bottom:5px;">
        Total: <span class="data-total">{{ progress.TotalData | format }}</span>
      </div>
      <!-- <div style="height:35px; width:100%; background:#f3f3f3; border-bottom:5px solid #f0f0f0;">
                        <div class="iblock " style="width:2px; height: 100%; background:#2ecc71; border-bottom:5px solid #27ae60;">
                        </div><div class="iblock" style="width:2px; height: 100%; background:#f1c40f; border-bottom:5px solid #f39c12;">
                        </div><div class="iblock" style="width:2px; height: 100%; background:#95a5a6; border-bottom:5px solid #7f8c8d;">
                        </div>
                    </div> -->
      <div style="margin-top:7px;">
        <!-- <i class="fa fa-check-circle" style="color:#2ecc71;"></i>&nbsp;&nbsp; -->
        <i class="fa fa-circle" style="color:#7cb5ec;"></i>&nbsp;&nbsp; Pusat
        (APBN)
        <span style="float:right;" class="data-apbn">
          {{ progress.APBN | format }}
        </span>
      </div>
      <div style="margin-top:7px;">
        <!-- <i class="fa fa-pause-circle" style="color:#f1c40f;"></i>&nbsp;&nbsp; -->
        <i class="fa fa-circle" style="color:#424247;"></i>&nbsp;&nbsp; Provinsi
        (APBD1)
        <span style="float:right;" class="data-apbd1">
          {{ progress.APBD1 | format }}
        </span>
      </div>
      <div style="margin-top:7px;">
        <!-- <i class="fa fa-times-circle" style="color:#95a5a6;"></i>&nbsp;&nbsp; -->
        <i class="fa fa-circle" style="color:#90ed7d;"></i>&nbsp;&nbsp; Kab/Kota
        (APBD2)
        <span style="float:right;" class="data-apbd2">
          {{ progress.APBD2 | format }}
        </span>
      </div>
      <div style="margin-top:7px;">
        <!-- <i class="fa fa-circle" style="color:#f3f3f3;"></i>&nbsp;&nbsp; -->
        <i class="fa fa-circle" style="color:#f7a35c;"></i>&nbsp;&nbsp; CSR
        <span style="float:right;" class="data-csr">
          {{ progress.CSR | format }}
        </span>
      </div>
      <div style="margin-top:7px;">
        <!-- <i class="fa fa-circle" style="color:#f3f3f3;"></i>&nbsp;&nbsp; -->
        <i class="fa fa-circle" style="color:#f75c5c;"></i>&nbsp;&nbsp; Lainnya
        <span style="float:right;" class="data-lain">
          {{ progress.Lain | format }}
        </span>
      </div>
      <div style="margin-top:7px;">
        <i class="fa fa-circle" style="color:#f75c5c;"></i>&nbsp;&nbsp; Validasi
        <span style="float:right;" class="data-validasi">
          {{ progress.Validasi | format }}
        </span>
      </div>
      <div style="margin-top:7px;">
        <i class="fa fa-circle" style="color:#f75c5c; visibility: hidden;"></i
        >&nbsp;&nbsp; Diluar Prioritas
        <span style="float:right;" class="data-luarprioritas">
          {{ progress.DiluarPrioritas | format }}
        </span>
      </div>
      <div style="margin-top:7px;">
        <i class="fa fa-circle" style="color:#f75c5c; visibility: hidden;"></i
        >&nbsp;&nbsp; Total Intervensi
        <span style="float:right;" class="data-intervensi">
          {{ progress.TotalIntervensi | format }}
        </span>
      </div>
      <div style="margin-top:7px;">
        <!-- <i class="fa fa-circle" style="color:#f3f3f3;"></i>&nbsp;&nbsp; -->
        <i class="fa fa-circle" style="color:#5cf7ea;"></i>&nbsp;&nbsp; Sisa
        PBDT
        <span style="float:right;" class="data-sisa">
          {{ progress.SisaPBDT | format }}
        </span>
      </div>
      <div style="margin-top:7px;">
        <!-- <i class="fa fa-circle" style="color:#f3f3f3;"></i>&nbsp;&nbsp; -->
        <i class="fa fa-circle" style="color:#f75c5c; visibility: hidden;"></i
        >&nbsp;&nbsp; Desa Bebas PBDT
        <span style="float:right;" class="data-desabebas">
          {{ progress.DesaBebas | format }}
        </span>
      </div>
      <div style="margin-top:7px;">
        <!-- <i class="fa fa-circle" style="color:#f3f3f3;"></i>&nbsp;&nbsp; -->
        <i class="fa fa-circle" style="color:#f75c5c; visibility: hidden;"></i
        >&nbsp;&nbsp; Jml Bebas PBDT
        <span style="float:right;" class="data-bebaspbdt">
          {{ progress.BebasPBDT | format }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import BarChart from "../../components/Charts/Bar";

export default {
  components: {
    BarChart
  },
  data: () => ({
    progress: {},
    datacollection: {},
    chartOptions: {
      title: {
        display: false,
        text: "Chart"
      },
      responsive: true
    }
  }),
  created() {
    this.populateProgress();
    this.populateChart();
  },
  methods: {
    async populateProgress() {
      let { data } = await this.$api.call("PRM.SelChartProgress", {
        TipeData: 115
      });
      this.progress = data[0];
      this.progress.TotalIntervensi =
        0 +
        data[0].APBN +
        data[0].APBD1 +
        data[0].APBD2 +
        data[0].CSR +
        data[0].Lain +
        data[0].Validasi +
        data[0].DiluarPrioritas;
      this.progress.SisaPBDT =
        data[0].TotalData - this.progress.TotalIntervensi;
    },
    async populateChart() {
      let { data } = await this.$api.call("PRM.SelChartYearly", {
        TipeData: 115
      });
      let labels = [];
      let colors = {
        APBN: "#E91E63",
        APBN_ALL: "#b71c1c",
        APBD1: "#3F51B5",
        APBD1_ALL: "#1A237E",
        APBD2: "#2196F3",
        APBD2_ALL: "#0D47A1",
        CSR: "#009688",
        CSR_ALL: "#006064"
      };
      let ds = [];
      data.forEach(d => {
        labels.push(d.Tahun);
        let i = 0;
        Object.keys(d).forEach(k => {
          if (colors[k]) {
            ds[i] = ds[i] || {
              data: [],
              baseColor: colors[k]
            };
            ds[i].label = k.replace("_", " ");
            ds[i].stack = k.match(/ALL$/) ? 2 : 1;
            ds[i].data.push(d[k]);
            i++;
          }
        });
      });
      this.datacollection = {
        labels: labels,
        datasets: ds
      };
    },
    randomScalingFactor() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    }
  }
};
</script>
<style lang="scss">
.yearly-chart {
  canvas {
    height: 100% !important;
  }
}
</style>
