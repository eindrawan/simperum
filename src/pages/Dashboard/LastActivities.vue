<template>
  <div
    style="width:100%; height:100%; background:white; box-sizing:border-box;"
  >
    <div style="padding:15px; border-bottom:1px solid #333;">
      <Select
        :value.sync="tipe"
        :items="[
          { val: 'BSPS', txt: 'BSPS 2020' },
          { val: 'BSPS-KL', txt: 'BSPS-KL 2020' },
          { val: 'Bankeu', txt: 'Bankeu 2020' },
          { val: 'Checklist', txt: 'Checklist 2020' },
          { val: 'Pengesahan', txt: 'Rekom 2020' },
          { val: 'Monitoring', txt: 'Monev 2018' },
          { val: 'LPJ', txt: 'LPJ 2019' },
          { val: 'HouseRekap', txt: 'Data Global' }
        ]"
      />
      <div
        style="color: gray;
                        font-size: small;
                        overflow: hidden;
                        white-space: nowrap;
                        display: flex;
                        padding-right: 20px;"
      >
        <div :class="{ hide: !headers[0].Title }" style="flex:1">
          <div class="xtitle" style="font-size: smaller;font-weight: 700;">
            {{ headers[0].Title }}
          </div>
          <div style="color:#000;" class="val">
            {{ headers[0].Total | format }}
          </div>
        </div>
        <div :class="{ hide: !headers[1].Title }" style="flex:1">
          <div class="xtitle" style="font-size: smaller;font-weight: 700;">
            {{ headers[1].Title }}
          </div>
          <div style="color:#000;" class="val">
            {{ headers[1].Total | format }}
          </div>
        </div>
        <div :class="{ hide: !headers[2].Title }" style="flex:1">
          <div class="xtitle" style="font-size: smaller;font-weight: 700;">
            {{ headers[2].Title }}
          </div>
          <div style="color:#000;" class="val">
            {{ headers[2].Total | format }}
          </div>
        </div>
        <div :class="{ hide: !headers[3].Title }" style="flex:1">
          <div class="xtitle" style="font-size: smaller;font-weight: 700;">
            {{ headers[3].Title }}
          </div>
          <div style="color:#000;" class="val">
            {{ headers[3].Total | format }}
          </div>
        </div>
        <div :class="{ hide: !headers[4].Title }" style="flex:1">
          <div class="xtitle" style="font-size: smaller;font-weight: 700;">
            {{ headers[4].Title }}
          </div>
          <div style="color:#000;" class="val">
            {{ headers[4].Total | format }}
          </div>
        </div>
        <div :class="{ hide: !headers[5].Title }" style="flex:1">
          <div class="xtitle" style="font-size: smaller;font-weight: 700;">
            {{ headers[5].Title }}
          </div>
          <div style="color:#000;" class="val">
            {{ headers[5].Total | format }}
          </div>
        </div>
      </div>
    </div>
    <div style="padding:10px; height:calc(100% - 125px); overflow:auto;">
      <List
        dbref="PRM.SelLastActivities"
        :dbparams="{ ActivityType: tipe }"
        :items.sync="items"
      >
        <template v-slot="{ row }">
          <div
            style="padding:5px; border-bottom:1px solid #eee;  font-size:14px;"
          >
            <div>
              <span style="font-weight: bold; text-transform: uppercase;"
                >{{ row.Kabupaten }} &nbsp;
                <span
                  title="total"
                  style="border-radius: 3px; border:1px solid #f3f3f3; position: relative; top:-4px; padding:3px 5px; color:gray; font-size: x-small;"
                  >{{ row.Total }}{{ row.TotalP }}</span
                ></span
              >
              <span style="float:right; font-size: x-small;">{{
                row.LastUpdate | format("fromNow")
              }}</span>
            </div>
            <div style="color:gray; display: flex;">
              <div
                :class="`item0 ${row.Title0 ? '' : 'hide'}`"
                :title="row.Title0"
                style="flex:1"
              >
                <i :class="`fa hide fa-${row.Icon0}`"></i
                ><span
                  style="font-size: 12px;font-weight: 700;"
                  class="xtitle"
                  >{{ row.Title0 }}</span
                ><br /><span style="color:#000;" class="val">{{
                  row.Verification0 ? row.Verification0 : ""
                }}</span>
              </div>
              <div
                :class="`item1 ${row.Title1 ? '' : 'hide'}`"
                :title="row.Title1"
                style="flex:1"
              >
                <i :class="`fa hide fa-${row.Icon1}`"></i
                ><span
                  style="font-size: 12px;font-weight: 700;"
                  class="xtitle"
                  >{{ row.Title1 }}</span
                ><br /><span style="color:#000;" class="val">{{
                  row.Verification1 ? row.Verification1 : ""
                }}</span
                ><span
                  style="border-radius: 3px; padding:3px 5px; background-color: orange; color:white; font-size: x-small;"
                  :class="row.NewVerification1 > 0 ? '' : 'hide'"
                  >{{ row.NewVerification1 }}</span
                >
              </div>
              <div
                :class="`item2 ${row.Title2 ? '' : 'hide'}`"
                :title="row.Title2"
                style="flex:1"
              >
                <i :class="`fa hide fa-${row.Icon2}`"></i
                ><span
                  style="font-size: 12px;font-weight: 700;"
                  class="xtitle"
                  >{{ row.Title2 }}</span
                ><br /><span style="color:#000;" class="val">{{
                  row.Verification2 ? row.Verification2 : ""
                }}</span
                ><span
                  style="border-radius: 3px; padding:3px 5px; background-color: orange; color:white; font-size: x-small;"
                  :class="row.NewVerification2 > 0 ? '' : 'hide'"
                  >{{ row.NewVerification2 }}</span
                >
              </div>
              <div
                :class="`item3 ${row.Title3 ? '' : 'hide'}`"
                :title="row.Title3"
                style="flex:1"
              >
                <i :class="`fa hide fa-${row.Icon3}`"></i
                ><span
                  style="font-size: 12px;font-weight: 700;"
                  class="xtitle"
                  >{{ row.Title3 }}</span
                ><br /><span style="color:#000;" class="val">{{
                  row.Verification3 ? row.Verification3 : ""
                }}</span
                ><span
                  style="border-radius: 3px; padding:3px 5px; background-color: orange; color:white; font-size: x-small;"
                  :class="row.NewVerification3 > 0 ? '' : 'hide'"
                  >{{ row.NewVerification3 }}</span
                >
              </div>
              <div
                :class="`item4 ${row.Title4 ? '' : 'hide'}`"
                :title="row.Title4"
                style="flex:1"
              >
                <i :class="`fa hide fa-${row.Icon4}`"></i
                ><span
                  style="font-size: 12px;font-weight: 700;"
                  class="xtitle"
                  >{{ row.Title4 }}</span
                ><br /><span style="color:#000;" class="val">{{
                  row.Verification4 ? row.Verification4 : ""
                }}</span
                ><span
                  style="border-radius: 3px; padding:3px 5px; background-color: orange; color:white; font-size: x-small;"
                  :class="row.NewVerification4 > 0 ? '' : 'hide'"
                  >{{ row.NewVerification4 }}</span
                >
              </div>
              <div
                :class="`item5 ${row.Title5 ? '' : 'hide'}`"
                :title="row.Title5"
                style="flex:1"
              >
                <i :class="`fa hide fa-${row.Icon5}`"></i
                ><span
                  style="font-size: 12px;font-weight: 700;"
                  class="xtitle"
                  >{{ row.Title5 }}</span
                ><br /><span style="color:#000;" class="val">{{
                  row.Verification5 ? row.Verification5 : ""
                }}</span
                ><span
                  style="border-radius: 3px; padding:3px 5px; background-color: orange; color:white; font-size: x-small;"
                  :class="row.NewVerification5 > 0 ? '' : 'hide'"
                  >{{ row.NewVerification5 }}</span
                >
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
    items: [],
    tipe: "BSPS",
    headers: [
      { Title: null, Total: 0 },
      { Title: null, Total: 0 },
      { Title: null, Total: 0 },
      { Title: null, Total: 0 },
      { Title: null, Total: 0 },
      { Title: null, Total: 0 }
    ]
  }),
  watch: {
    items(val) {
      if (val.length) {
        this.headers = [
          { Title: null, Total: 0 },
          { Title: null, Total: 0 },
          { Title: null, Total: 0 },
          { Title: null, Total: 0 },
          { Title: null, Total: 0 },
          { Title: null, Total: 0 }
        ];

        val.forEach(d => {
          this.headers[0].Title = d.Title0;
          this.headers[0].Total += d.Verification0;
          this.headers[1].Title = d.Title1;
          this.headers[1].Total += d.Verification1;
          this.headers[2].Title = d.Title2;
          this.headers[2].Total += d.Verification2;
          this.headers[3].Title = d.Title3;
          this.headers[3].Total += d.Verification3;
          this.headers[4].Title = d.Title4;
          this.headers[4].Total += d.Verification4;
          this.headers[5].Title = d.Title5;
          this.headers[5].Total += d.Verification5;
        });
      }
    }
  }
};
</script>
<style lang="scss">
.hide {
  display: none;
}
</style>
