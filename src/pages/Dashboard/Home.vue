<template>
  <Page title="Dashboard">
    <div style="display:flex; height:100%;">
      <div style="flex:2; background:white;" v-if="this.user.UserID < 5">
        <Select
          :value.sync="tipeData"
          :items="[
            { val: '115', txt: 'DATA 2015' },
            { val: '118', txt: 'DATA 2018' },
            { val: '119', txt: 'DATA 2019' },
            { val: '120', txt: 'DATA 2020' }
          ]"
          style="margin-left: calc(50% - 80px);"
        />
        <YearlyChart />
      </div>
      <div style="flex:2; margin: 0 5px;" v-if="this.user.UserID < 5">
        <Rekap />
      </div>
      <div id="dvLastUpdate" class="boxboard" style="flex:2; max-width:34vw;">
        <LastActivities />
      </div>
    </div>
  </Page>
</template>

<script>
// @ is an alias to /src
import LastActivities from "./LastActivities";
import Rekap from "./Rekap";
import YearlyChart from "./YearlyChart";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    LastActivities,
    Rekap,
    YearlyChart
  },
  data: () => ({
    tipeData: "115"
  }),
  computed: {
    ...mapGetters({
      user: "getUser"
    })
  },
  mounted() {
    console.log(this.user);
  }
};
</script>
<style lang="scss">
.hide {
  display: none;
}
</style>
