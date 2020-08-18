<template>
  <div class="sidebar-validasi">
    <div style="display:flex; font-size:12px;" v-if="!hideTabs">
      <div
        class="tab"
        @click="tabId = 2"
        style="flex: 0 0 120px"
        :class="{
          active: tabId == 2
        }"
      >
        APBD PROV.
      </div>
      <div
        class="tab"
        @click="tabId = 1"
        style="flex: 0 0 120px"
        :class="{
          active: tabId == 1
        }"
      >
        APBN (BSPS)
      </div>
      <div
        class="tab"
        @click="tabId = 9"
        :class="{
          active: tabId == 9
        }"
      >
        BSPS-KL
      </div>
    </div>
    <div style="padding:10px; display:flex;">
      <Select
        v-show="!searchMode"
        dbref="PRM.SelProposal"
        :value.sync="proposal"
        :valueAsObject="true"
        width="80px"
        style="margin-right:10px;"
      />
      <Select
        v-show="!searchMode"
        dbref="PRM.SelPBDTCity"
        :value.sync="kabupaten"
        :valueAsObject="true"
        width="190px"
      />
      <Input
        type="text"
        v-show="searchMode"
        :value.sync="keyword"
        placeholder="Cari .."
        width="280px"
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
        :dbparams="listParams"
        :rebind="rebind"
        :filters="{
          keyword: keyword,
          filter: filterArea
        }"
        :height="`calc(100vh - ${hideTabs ? 160 : 200}px)`"
        @itemClick="AreaClicked"
        :selectOnLoad="true"
      >
        <template v-slot="{ row }">
          <div :class="`ordr-${row.Ordr}`">
            <div>{{ row.AreaName }}</div>
            <div class="status">
              <div
                :class="
                  `badge s-${row.Rekom ? row.Rekom.replace(' ', '') : ''}`
                "
              >
                {{ row.Rekom }}
              </div>
              <div class="badge s-jml">
                {{ row.Approved }} / {{ row.JmlBansos }}
              </div>
            </div>
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
    proposal: { InputName: 2020 },
    selectedArea: {},
    searchMode: false,
    keyword: "",
    tabId: 2
  }),
  props: {
    value: Object,
    hideTabs: Boolean,
    rebind: Number
  },
  computed: {
    listParams() {
      return {
        Kabupaten: this.kabupaten.txt,
        SumberID: this.tabId,
        ProposalID: this.proposal.ProposalID
      };
    }
  },
  methods: {
    AreaClicked(item) {
      if (!item || !item.AreaID) return;
      this.$emit("update:value", {
        tabId: this.tabId,
        Sumber: this.tabId,
        Tahun: this.proposal.InputName,
        ProposalID: this.proposal.ProposalID,
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
  background: white;
  .tab {
    flex: 1;
    font-size: 13px;
    padding: 5px 10px;
    background: #ddd;
    color: gray;
    border-right: 0.5px solid silver;
    cursor: pointer;

    &.active {
      background: white;
      font-weight: bold;
      border: 1px solid silver;
      border-bottom: transparent;
    }
  }
  .ui-list {
    .--item {
      border-bottom: 1px solid #ddd;
      padding: 5px 8px;
      font-size: 12px;
      .ordr-1 {
        font-weight: bold;
        .status {
          display: none;
        }
      }
      .ordr-2 {
        padding-left: 10px;
        display: flex;

        & > div {
          flex: 1;
        }
        .status {
          justify-content: flex-end;
          display: flex;

          .badge {
            padding-right: 9px;
            padding-left: 9px;
            border-radius: 9px;
          }

          .s-jml {
            background-color: #f3f3f3;
          }

          .s-DISETUJUI {
            background: #4caf50 !important;
            color: white !important;
          }
          .s-REKOM1 {
            background: #c0ca33 !important;
            color: white !important;
          }
          .s-REKOM2 {
            background: #ff6f00 !important;
            color: white !important;
          }
          .s-REKOM3 {
            background: #aa00ff !important;
            color: white !important;
          }
          .s-REKOM4 {
            background: #9c27b0 !important;
            color: white !important;
          }
          .s-REKOM5 {
            background: yellow !important;
            color: #333 !important;
          }
        }
      }
    }
  }
}
</style>
