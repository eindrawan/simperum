<template>
  <div>
    <div id="dvjml" class="" style="width:calc(100% - 20px)">
      <div
        style="background: rgba(255, 255, 255, 0.5);
                        margin-top: -10px;
                        padding: 15px 13px;
                        font-family: Raleway;
                        font-weight: bold;"
      >
        <i
          class="fa fa-map-marker"
          style="color: silver; margin-right: 10px;"
        ></i>
        <span id="areaname"
          >{{ details.Kabupaten }}, {{ details.Kecamatan }},
          {{ details.Kelurahan }}</span
        >
        <span
          style="padding: 10px 20px;
                            background: white;
                            border-radius: 20px;
                            margin-left: 20px;"
        >
          <i class="fa fa-shield" style="color: orangered"></i>
          &nbsp;
          <span id="StatusPBDT">BELUM BEBAS PBDT</span>
        </span>

        <v-btn
          style="float:right; margin-top:-5px;"
          @click="$emit('clickTambahBaru')"
        >
          <v-icon left>mdi-plus</v-icon> TAMBAH BARU
        </v-btn>
      </div>
      <div
        style="background: rgba(255,255,255,0.7);
                        padding: 5px 15px;
                        font-family: Raleway;
                        text-transform: uppercase;
                        font-size: small;"
      >
        <span id="JmlRumah" style="margin-right: 20px;"
          >JML RUMAH: <b>{{ details.JmlRumah }}</b></span
        >
        <span id="JmlPenduduk" style="margin-right: 20px;"
          >JML PENDUDUK: <b>{{ details.JmlPenduduk }}</b></span
        >
        <span id="LuasArea" style="margin-right: 20px;"
          >LUAS DESA: <b>{{ details.JmlRTLH }}</b></span
        >
        <span id="JmlBacklog" style="margin-right: 20px;"
          >JML BACKLOG: <b>{{ details.JmlBacklog }}</b></span
        >
        <span id="JmlNonSertifikat" style="margin-right: 20px;"
          >BELUM BERSERTIFIKAT: <b>{{ details.JmlNonSertifikat }}</b></span
        >

        <v-btn
          text
          color="primary"
          small
          style="float:right;    margin-top: -5px;"
        >
          <v-icon left>mdi-pencil</v-icon>
          EDIT
        </v-btn>
      </div>

      <br />
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    details: {}
  }),
  props: {
    dbref: {
      type: String,
      default: "PRM.SelAreaDet"
    },
    dbparams: [String, Object]
  },
  watch: {
    dbparams() {
      this.populate();
    }
  },
  methods: {
    async populate() {
      let { data } = await this.$api.call(this.dbref, this.dbparams);
      this.details = data[0];
    }
  }
};
</script>
<style lang="scss"></style>
