<template>
  <div class="form-inline" style="padding:10px;">
    <div class="report-title">LAPORAN {{ options.rptname }}</div>
    <component
      v-for="com in components"
      :is="com.type"
      :key="com.id"
      :value.sync="params[com.id]"
      :dbref="com.dbref"
      :label="com.text"
    />
    <v-btn color="primary" @click="Generate">
      <div v-show="!loading">Generate</div>
      <div v-show="loading">
        <v-icon left>access_time</v-icon> Please wait ...
      </div>
    </v-btn>
    <v-btn
      color="green"
      @click="GenerateExcel"
      style="color:white; margin-left:8px;"
    >
      <v-icon>mdi-microsoft-excel</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  data: () => ({
    params: {},
    components: [],
    loading: false
  }),
  props: {
    options: Object,
    generatedUrl: String
  },
  watch: {
    options() {
      this.getParams();
    }
  },
  methods: {
    async getParams() {
      let ret = await this.$api.post(`/report/GetParamsVue`, this.options);
      this.components = ret.data;
    },
    async Generate() {
      this.loading = true;
      let ret = await this.$api.post(`/report/Generic/pdf`, {
        ...this.options,
        ...this.params
      });
      this.$emit("update:generatedUrl", this.$api.url + "/report" + ret.data);
      this.loading = false;
    },
    async GenerateExcel() {
      this.loading = true;
      let ret = await this.$api.post(`/report/Generic/xlsx`, {
        ...this.options,
        ...this.params
      });
      this.$api.download(this.$api.url + "/report" + ret.data);
      // this.$emit("update:generatedUrl", this.$api.url + ret.data);
      this.loading = false;
    }
  }
};
</script>
<style lang="scss">
.report-title {
  margin: -12px 0 8px 0;
  font-family: "Raleway";
  font-size: x-large;
}
</style>
