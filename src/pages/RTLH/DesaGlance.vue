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
          color="success"
          v-show="!details.KabKotaApproval && dbparams.Sumber"
          @click="SavePengesahan(1)"
        >
          SETUJUI USULAN
        </v-btn>
        <v-btn
          style="float:right; margin-top:-5px;"
          color="warning"
          v-show="details.KabKotaApproval && dbparams.Sumber"
          @click="SavePengesahan(0)"
        >
          BATALKAN PERSETUJUAN
        </v-btn>
        <v-btn
          v-if="addNew"
          style="float:right; margin-top:-5px;"
          @click="$emit('click-tambah-baru')"
          color="primary"
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
          >LUAS DESA: <b>{{ details.LuasArea }}</b></span
        >
        <span id="JmlBacklog" style="margin-right: 20px;"
          >JML BACKLOG: <b>{{ details.JmlBacklog }}</b></span
        >
        <span id="JmlNonSertifikat" style="margin-right: 20px;"
          >BELUM BERSERTIFIKAT: <b>{{ details.JmlNonSertifikat }}</b></span
        >
      </div>
      <div
        v-if="dbparams.Sumber"
        style="background: rgba(255,255,255,0.7);
                    margin-bottom: 10px;
                    padding: 5px 15px;
                    font-family: Raleway; 
                    text-transform: uppercase; 
                    font-size: small;"
      >
        <span id="JmlUsulan" style="margin-right: 20px;"
          >USULAN: <b>{{ jmlUsulan }}</b></span
        >
        <span id="JmlKuota" style="margin-right: 20px;"
          >KUOTA: <b>{{ details.Kuota }}</b></span
        >
        <span id="JmlValidasi" style="margin-right: 20px;"
          >VALIDASI: <b>{{ details.SudahValidasi }}</b></span
        >
        <span id="JmlRTLH" style="margin-right: 20px;"
          >JML RTLH: <b>{{ details.JmlRTLH }}</b></span
        >
        <!-- <a id="a-semuadata" href="#" style="float: right; margin-left:10px;"><i class="fa fa-eye" style="margin-right:5px;"></i>Semua Data</a> -->

        <v-btn
          style="float: right; margin-top: -5px; "
          text
          small
          color="primary"
          @click="PrintKuisoner"
          ><v-icon left>print</v-icon> Kuisioner Validasi</v-btn
        >
        <v-btn
          style="float: right; margin-top: -5px; "
          text
          small
          color="primary"
          @click="PrintKuisonerKosong"
          ><v-icon left>print</v-icon> Kuisioner Kosong</v-btn
        >
      </div>
      <div
        v-if="!dbparams.Sumber"
        style="background: rgba(255,255,255,0.7);
                    margin-bottom: 10px;
                    padding: 5px 15px;
                    font-family: Raleway; 
                    text-transform: uppercase; 
                    font-size: small;"
      >
        <span id="JmlRTLH" style="margin-right: 20px;"
          >JML RTLH DESA: <b>{{ details.JmlRTLH }}</b></span
        >
        <span id="JmlRTLH" style="margin-right: 20px;"
          >JML RTLH SIMPERUM: <b>{{ details.JmlRTLHSimperum }}</b></span
        >
        <span id="JmlValidasi" style="margin-right: 20px;"
          >VALIDASI: <b>{{ details.SudahValidasi }}</b></span
        >
        <!-- <a id="a-semuadata" href="#" style="float: right; margin-left:10px;"><i class="fa fa-eye" style="margin-right:5px;"></i>Semua Data</a> -->
        <v-btn
          style="float: right; margin-top: -5px; "
          text
          small
          color="primary"
          @click="PrintKuisoner"
          ><v-icon left>print</v-icon> Cetak Kuisioner Validasi RTLH</v-btn
        >
      </div>
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
      default: "PRM.SelValidasiInfo"
    },
    dbparams: [String, Object],
    jmlUsulan: [Number, String],
    addNew: Boolean,
    isApproved: Number
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
    },
    async SavePengesahan(appv) {
      if (this.jmlUsulan < 3 && this.dbparams.tabId == 2 && appv == 1)
        if (!confirm("Jml usulan kurang dari 3, anda yakin?")) return;

      await this.$api.call("PRM.SavPengesahanKabupaten", {
        ...this.dbparams,
        IsApproved: appv
      });

      let { data } = await this.$api.call(this.dbref, this.dbparams);
      this.details = data[0];
      this.$emit("update:isApproved", this.details.KabKotaApproval);
    },
    async PrintKuisonerKosong() {
      this.$api.download("/report/get/templates/KuisonerBaru.docx");
    },
    async PrintKuisoner() {
      let ret = await this.$api.post(
        "/reports/template/KuisonerTerisi.docx",
        this.dbparams
      );
      if (ret.success) this.$api.download("/report/" + ret.data);
    }
  }
};
</script>
<style lang="scss"></style>
