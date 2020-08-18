<template>
  <div class="sidebar-validasi">
    <div style="padding:10px; display:flex;">
      <Select
        v-show="!searchMode"
        dbref="PRM.SelPBDTCity"
        :value.sync="kabupaten"
        :valueAsObject="true"
      />
      <Input
        type="text"
        v-show="searchMode"
        :value.sync="keyword"
        placeholder="Cari .."
      />
      <v-icon
        style="height: 27px; margin-left:10px;"
        v-show="!searchMode"
        @click="searchMode = !searchMode"
        >search</v-icon
      >
      <v-icon
        style="height: 27px; margin-left:10px;"
        v-show="searchMode"
        @click="searchMode = !searchMode"
        >clear</v-icon
      >
    </div>
    <div>
      <List
        dbref="PRM.SelProposalArea"
        :dbparams="{
          Kabupaten: kabupaten.txt
        }"
        :filters="{
          keyword: keyword,
          filter: filterArea
        }"
        height="calc(100vh - 165px)"
        @itemClick="AreaClicked"
      >
        <template v-slot="{ row }">
          <div :class="`ordr-${row.Ordr}`">
            {{ row.AreaName }}
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    kabupaten: { val: null, txt: null },
    selectedArea: {},
    searchMode: false,
    keyword: ""
  }),
  props: {
    value: Object
  },
  methods: {
    AreaClicked(item) {
      if (!item || !item.AreaID) return;
      this.$emit("update:value", {
        Kabupaten: this.kabupaten.txt,
        Kecamatan: item.Kecamatan,
        Kelurahan: item.AreaName,
        KelurahanID: item.AreaID
      });
    },
    filterArea(item) {
      return item.AreaName.match(new RegExp(this.keyword, "i"));
    }
  }
};
</script>
<style lang="scss">
.sidebar-validasi {
  .ui-list {
    .--item {
      border-bottom: 1px solid #ddd;
      padding: 5px 8px;
      font-size: 12px;
      .ordr-1 {
        font-weight: bold;
      }
      .ordr-2 {
        padding-left: 10px;
      }
    }
  }
}
</style>
