<template>
  <Modal title="PROPOSAL" :show.sync="xshow" width="900px" @onSubmit="Save">
    <div style="display: flex; font-size:14px;">
      <div>
        <div style="padding:10px; background:#f3f3f3;">
          <i class="fa fa-globe"></i>&nbsp;&nbsp;PETA LOKASI
        </div>
        <div id="MapDiv" style="position: relative;">
          <Map
            :lat.sync="forms.GeoLat"
            :lon.sync="forms.GeoLng"
            style="width:450px; height:340px; display:block;"
          />
        </div>
      </div>
      <div>
        <div
          style="padding:10px 0; background:#f3f3f3; width:100%; display: flex;"
        >
          <div class="iblock" style="flex:1; padding-left:10px;">
            <i class="fa fa-file"></i>&nbsp;&nbsp;RENCANA KEG.
          </div>
          <div class="iblock" style="flex:1; padding-left:10px;">
            <i class="fa fa-file"></i>&nbsp;&nbsp;BA. MUSDES
          </div>
          <div class="iblock" style="width:140px; padding-left:10px;">
            <i class="fa fa-users"></i>&nbsp;&nbsp;DFTR HADIR
          </div>
        </div>
        <div style="display: flex;">
          <Uploader :value.sync="forms.PermohonanBansos"></Uploader>
          <Uploader :value.sync="forms.BAPokmas"></Uploader>
          <Uploader :value.sync="forms.SKPokmas"></Uploader>
        </div>
        <div
          style="padding:10px 0; background:#f3f3f3; width:100%; display: flex;"
        >
          <div class="iblock" style="width:140px; padding-left:10px;">
            <i class="fa fa-user"></i>&nbsp;&nbsp;SP KEPDES
          </div>
          <div class="iblock" style="flex:1; padding-left:10px;">
            <i class="fa fa-home"></i>&nbsp;&nbsp;RUMAH DEPAN
          </div>
          <div class="iblock" style="flex:1; padding-left:10px;">
            <i class="fa fa-home"></i>&nbsp;&nbsp;RMH SAMPING
          </div>
        </div>
        <div style="display: flex;">
          <Uploader :value.sync="forms.PaktaIntegritas"></Uploader>
          <Uploader :value.sync="forms.RumahDepan"></Uploader>
          <Uploader :value.sync="forms.RumahSamping"></Uploader>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  data: () => ({
    xshow: false,
    forms: {}
  }),
  props: {
    show: Boolean,
    nik: [String, Number]
  },
  watch: {
    show(val) {
      this.xshow = val;
    },
    xshow(val) {
      if (!val) this.forms = {};
      else if (this.xshow) this.populate();
      this.$emit("update:show", val);
    }
  },
  methods: {
    async populate() {
      this.loading = true;
      if (this.nik) {
        let { data } = await this.$api.call("PRM.SelPersonProposal", {
          NIK: this.nik
        });
        this.forms = data[0];
      } else {
        this.forms = {};
      }
      this.loading = false;
    },
    async Save() {
      this.error = "";
      let ret = await this.$api.call("PRM.SavPersonProposal", {
        ...this.forms,
        GeoLoc: this.forms.GeoLat
          ? this.forms.GeoLat + "|" + this.forms.GeoLng
          : null
      });
      if (ret.success) {
        this.xshow = false;
      } else this.error = ret.message;
    }
  }
};
</script>
<style lang="scss">
.modal-proposal {
  .v-dialog--content {
    padding: 0;
  }
}
</style>
