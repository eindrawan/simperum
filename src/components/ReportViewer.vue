<template>
  <div id="report-viewer" v-show="show">
    <div class="report-toolbar">
      <v-icon
        style="float:left; margin-top:7px;"
        @click="$emit('update:show', false)"
        >clear</v-icon
      >
      <v-btn color="green" @click="downloadExcel">
        Download Excel
      </v-btn>
    </div>
    <div class="report-frame">
      <div v-show="!reportUrl" style="text-align:center; padding-top:50px;">
        Please wait while we generate the report ...
      </div>
      <iframe :src="reportUrl" />
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    reportUrl: null
  }),
  props: {
    url: String,
    params: Object,
    show: Boolean,
    options: Object,
    filetype: {
      type: String,
      default: "pdf"
    }
  },
  watch: {
    show(val) {
      if (val) {
        // if (this.url) this.reportUrl = this.url;
        // else if (this.options)
        this.generate();
      } else this.reportUrl = null;
    }
  },
  mounted() {
    this.generate();
  },
  methods: {
    async generate() {
      if (this.options) {
        let data = await this.$api.post(
          "/report/generate/" + this.filetype,
          this.options
        );
        if (data.success) {
          if (this.filetype === "xlsx") {
            this.$api.download(this.$api.url + "/report" + data.data);
            this.$emit("update:show", false);
          } else this.reportUrl = this.$api.url + "/report" + data.data;
        } else {
          this.$toast.open({
            type: "error",
            message: data.message,
            position: "top",
            dismissible: true
          });
          this.$emit("update:show", false);
        }
      } else if (this.url) {
        this.reportUrl = this.url;
      }
    },
    downloadExcel() {
      this.reportUrl = this.reportUrl
        .replace(".pdf", ".xlsx")
        .replace("/pdf", "/xlsx");
    },
    ReportLoaded() {
      // if (this.filetype === "xlsx") this.$emit("update:show", false);
      console.log("progress");
    }
  }
};
</script>
<style lang="scss">
#report-viewer {
  position: absolute;
  top: 50px;
  right: 0;
  width: 75vw;
  height: calc(100vh - 50px);
  background: white;
  z-index: 1;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.3);
  .report-toolbar {
    text-align: right;
    padding: 10px;
  }
  .report-frame {
    width: 100%;
    height: calc(100% - 58px);
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
}
</style>
