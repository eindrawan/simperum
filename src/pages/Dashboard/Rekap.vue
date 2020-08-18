<template>
  <div class="rekap-widget">
    <div class="rekap-box" v-for="(item, idx) in items" :key="idx">
      <div
        style="float:right; font-family:Raleway; text-align:right; position:relative; top:-8px;"
      >
        <div>Dalam Proses</div>
        <div style="font-size:x-large; margin-top:-3px;" class="total">
          {{ item.Total }}
        </div>
      </div>
      <div style="font-size:x-large; font-family:Raleway;" class="year">
        {{ item.Tahun }}
      </div>
      <div
        style="height:5px; width:100%; position:relative; top:-3px; display:flex; background:#f1c40f;"
        class="bar"
      >
        <div
          class="iblock"
          style="flex: 1; height: 100%; background:#2c3e50;"
        ></div>
        <div
          class="iblock"
          style="flex:1; height: 100%;background:#e67e22;"
        ></div>
        <div
          class="iblock"
          style="flex:1; height: 100%;background:#f1c40f;"
        ></div>
      </div>
      <div class="iblock" style="width:50%;">
        <div style="margin-top:7px;">
          <i class="fa fa-check-circle" style="color:#2c3e50;"></i>&nbsp;&nbsp;

          <span
            class="n1"
            style="color: white; padding: 0 5px; background: #333; font-size: x-small; border-radius: 3px; position: relative; top: -2px; width: 35px; text-align: right; display: inline-block; left: 15px;"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    items: []
  }),
  async created() {
    let { data } = await this.$api.call("PRM.SelChartByYear", {
      TipeData: 115
    });
    this.items = data.map(d => {
      return {
        ...d,
        Detail: d.Detail ? String(d.Detail).split("|") : null
      };
    });
  }
};
</script>
<style lang="scss">
.rekap-widget {
  .rekap-box {
    width: 100%;
    height: calc(25% + 50px);
    background: white;
    padding: 15px;
    box-sizing: border-box;
    border-bottom: 5px solid #ece8df;
  }
}
</style>
