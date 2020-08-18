<template>
  <Modal
    title="VALIDASI DETAIL"
    :show.sync="x_show"
    :loading="loading"
    :error="error"
    :showActions="!disabled"
    @onSubmit="Save"
  >
    <template v-slot:left-action>
      <v-btn text color="red" @click="Delete">Hapus</v-btn>
    </template>
    <div style="display: flex; height:400px; width:680px;" class="form-inline">
      <div
        style="width: 50px;
        color: #333;"
      >
        <div
          class="tab"
          @click="tabId = 'Individu'"
          :class="{
            active: tabId == 'Individu'
          }"
        >
          <v-icon style="font-size:36px;">person</v-icon>
        </div>
        <div
          tab="Rumah"
          class="tab"
          @click="tabId = 'Rumah'"
          :class="{
            active: tabId == 'Rumah'
          }"
        >
          <v-icon style="font-size:36px;">home</v-icon>
        </div>
        <div
          tab="Konstruksi"
          class="tab"
          @click="tabId = 'Konstruksi'"
          :class="{
            active: tabId == 'Konstruksi'
          }"
        >
          <v-icon style="font-size:36px;">mdi-hammer-wrench</v-icon>
        </div>
        <div
          tab="Kesehatan"
          class="tab"
          @click="tabId = 'Kesehatan'"
          :class="{
            active: tabId == 'Kesehatan'
          }"
        >
          <v-icon style="font-size:36px;">mdi-stethoscope</v-icon>
        </div>
        <div
          tab="Foto"
          class="tab"
          @click="tabId = 'Foto'"
          :class="{
            active: tabId == 'Foto'
          }"
        >
          <v-icon style="font-size:36px;">collections</v-icon>
        </div>
        <div
          tab="FAQ"
          class="tab"
          @click="tabId = 'FAQ'"
          :class="{
            active: tabId == 'FAQ'
          }"
        >
          <v-icon style="font-size:36px;">mdi-account-question</v-icon>
        </div>
      </div>
      <div style="width:500px; border-left:1px solid silver; margin-left:8px;">
        <div v-show="tabId == 'Individu'">
          <div style="padding: 10px;">
            <Input label="NIK" :value.sync="forms.NIK" />
            <Input label="Nama" :value.sync="forms.Nama" />
            <Input label="Alamat" :value.sync="forms.Alamat" />
            <Input label="Umur" :value.sync="forms.Umur" />
            <Select
              label="Jns. Kelamin"
              :value.sync="forms.JenisKelamin"
              :items="[
                { val: 'L', txt: 'Laki-Laki' },
                { val: 'P', txt: 'Perempuan' }
              ]"
            />
            <Select
              label="Pendidikan"
              :value.sync="forms.Pendidikan"
              dbref="PRM.SelPendidikan"
            />
            <Select
              label="Pekerjaan"
              :value.sync="forms.Pekerjaan"
              dbref="PRM.SelPekerjaan"
            />
            <Select
              label="Penghasilan"
              :value.sync="forms.Penghasilan"
              dbref="PRM.SelPenghasilan"
            />
            <Select
              label="Mampu Swadaya"
              :value.sync="forms.MampuSwadaya"
              :items="[
                { val: '1', txt: 'Mampu' },
                { val: '0', txt: 'Tidak Mampu' }
              ]"
            />
          </div>
        </div>
        <div v-show="tabId == 'Rumah'">
          <div style="padding: 10px;">
            <Select
              label="Sts. Rumah"
              :value.sync="forms.KepemilikanRumah"
              :items="[
                { val: 1, txt: 'Milik Sendiri' },
                { val: 2, txt: 'Kontrak/Sewa' },
                { val: 3, txt: 'Bebas Sewa' },
                { val: 4, txt: 'Dinas' },
                { val: 5, txt: 'Lainnya' }
              ]"
            />
            <Select
              label="Sts. Lahan"
              :value.sync="forms.KepemilikanLahan"
              dbref="PRM.SelStatusTanah"
            />
            <Checkbox
              label="Tanah Lain"
              :value.sync="forms.TanahLain"
              :text="forms.TanahLain ? 'Memiliki' : 'Tidak Memiliki'"
            />
            <Checkbox
              label="Rumah Lain"
              :value.sync="forms.RumahLain"
              :text="forms.RumahLain ? 'Memiliki' : 'Tidak Memiliki'"
            />
            <Input
              label="Luas Rumah"
              type="number"
              :value.sync="forms.LuasRumah"
            />
            <Input
              label="Jml. Penghuni"
              type="number"
              :value.sync="forms.JmlPenghuni"
            />
            <Input
              label="Jml. Keluarga"
              type="number"
              :value.sync="forms.JmlKK"
            />
            <Label label="Sumber Bantuan">
              <Select
                :value.sync="forms.Sumber"
                dbref="PRM.SelSumber"
                style="margin-right:10px;"
              />
              <Input
                type="number"
                :value.sync="forms.Tahun"
                placeholder="Tahun"
                width="80px"
              />
            </Label>

            <Select
              label="Kawasan"
              :value.sync="forms.Kawasan"
              dbref="PRM.SelKawasan"
            />
          </div>
        </div>
        <div v-show="tabId == 'Konstruksi'">
          <div style="padding: 10px;">
            <Checkbox
              label="Pondasi*"
              :value.sync="forms.AdaPondasi"
              :text="forms.AdaPondasi ? 'Ada Pondasi' : 'Tidak Ada'"
            />
            <Select
              label="Kondisi Kolom*"
              :value.sync="forms.KondisiKolom"
              dbref="PRM.SelKondisi"
            />
            <Select
              label="Kondisi Balok*"
              :value.sync="forms.KondisiBalok"
              dbref="PRM.SelKondisi"
            />
            <Select
              label="Rangka Atap*"
              :value.sync="forms.KondisiRangka"
              dbref="PRM.SelKondisi"
            />
            <Select
              label="Bahan Lantai*"
              :value.sync="forms.LantaiID"
              dbref="PRM.SelLantai"
            />
            <Select
              label="Kondisi Lantai*"
              :value.sync="forms.KondisiLantai"
              dbref="PRM.SelKondisi"
            />
            <Select
              label="Bahan Dinding*"
              :value.sync="forms.DindingID"
              dbref="PRM.SelDinding"
            />
            <Select
              label="Kondisi Dinding*"
              :value.sync="forms.KondisiDinding"
              dbref="PRM.SelKondisi"
            />
            <Select
              label="Bahan Atap*"
              :value.sync="forms.AtapID"
              dbref="PRM.SelAtap"
            />
            <Select
              label="Kondisi Atap*"
              :value.sync="forms.KondisiAtap"
              dbref="PRM.SelKondisi"
            />
          </div>
        </div>
        <div v-show="tabId == 'Kesehatan'">
          <div style="padding: 10px;">
            <Checkbox
              label="Jendela*"
              :value.sync="forms.AdaJendela"
              :text="forms.AdaJendela ? 'Ada Jendela' : 'Tidak Ada'"
            />
            <Checkbox
              label="Ventilasi*"
              :value.sync="forms.AdaVentilasi"
              :text="forms.AdaVentilasi ? 'Ada Ventilasi' : 'Tidak Ada'"
            />
            <Select
              label="Sumber Air"
              :value.sync="forms.SumberAir"
              dbref="PRM.SelSumberAir"
            />
            <Select
              label="Kamar Mandi/Jamban"
              :value.sync="forms.KamarMandi"
              dbref="PRM.SelKamarMandi"
            />
            <Select
              label="Jarak Septik Tank"
              :value.sync="forms.JarakSepticTank"
              :items="[
                { val: 0, txt: '&lt; 10m' },
                { val: 1, txt: '&gt;= 10m' }
              ]"
            />
            <Select
              label="Sumber Penerangan"
              :value.sync="forms.Penerangan"
              dbref="PRM.SelPenerangan"
            />
          </div>
        </div>
        <div v-show="tabId == 'Foto'">
          <div style="padding-left: 10px; display:flex;">
            <div>
              <div style="padding: 8px 12px; font-size:14px;">
                Foto Depan
              </div>
              <Uploader :value.sync="forms.RumahDepan"> </Uploader>
              <div style="padding: 8px 12px; font-size:14px;">
                Foto Samping
              </div>
              <Uploader :value.sync="forms.RumahSamping"> </Uploader>
            </div>
            <div style="padding-left:8px">
              <Map
                :lat.sync="forms.GeoLat"
                :lon.sync="forms.GeoLng"
                width="450px"
                height="373px"
                :searchbox="true"
              />
            </div>
          </div>
        </div>
        <div v-show="tabId == 'FAQ'">
          <Panel
            dbref="PRM.SelWhyPBDTEdit"
            :dbparams="{ NoRef: forms.NoRef }"
            :autobind="false"
            style="padding:10px; font-size:14px;"
          >
            <template v-slot="{ first }">
              <div>Alasan tidak masuk input usulan:</div>
              <div>{{ first.Message }}</div>
            </template>
          </Panel>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  data: () => ({
    x_show: false,
    loading: false,
    error: "",

    forms: {},
    tabId: "Individu"
  }),
  props: {
    show: {
      type: Boolean,
      default: false
    },
    noRef: [String, Number],
    area: Object,
    disabled: Boolean
  },
  watch: {
    show(val) {
      this.x_show = val;
      this.tabId = "Individu";
      this.error = "";
    },
    x_show(val) {
      if (!val) this.forms = {};
      else this.populate();
      this.$emit("update:show", val);
    }
  },
  methods: {
    async populate() {
      this.loading = true;
      if (this.noRef) {
        let { data } = await this.$api.call("PRM_SelPBDTDetail", {
          NoRef: this.noRef
        });
        this.forms = data[0];
      } else {
        this.forms = {};
      }
      this.loading = false;
    },
    async Save() {
      this.error = "";
      let ret = await this.$api.call("PRM.SavPBDTDetail", {
        ...this.area,
        ...this.forms
      });
      this.$api.post(this.$api.url + "/api/ertlh/update/" + this.forms.NIK);
      if (ret.success) {
        this.x_show = false;
      } else this.error = ret.message;
    },
    async Delete() {
      let ret = await this.$api.call("PRM.DelPBDTedit", {
        ...this.area,
        ...this.forms
      });
      if (ret.success) {
        this.x_show = false;
      } else this.error = ret.message;
    }
  }
};
</script>
<style lang="scss" scoped>
.tab {
  width: 50px;
  height: 50px;
  vertical-align: top;
  cursor: pointer;
  text-align: center;
  border-bottom: 1px solid silver;

  .v-icon {
    margin-top: 8px;
    color: silver;
  }
}

.tab.active {
  background: #f3f3f3;
  position: relative;
  z-index: 2;
  .v-icon {
    color: #333;
  }
}

.imgbox {
  width: 150px;
  height: 150px;
  border-right: 1px solid white;
  box-sizing: border-box;
}
</style>
