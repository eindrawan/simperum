<template>
  <Modal
    title="VALIDASI DETAIL"
    :show.sync="x_show"
    :loading="loading"
    :error="error"
    :showActions="!disabled"
    @onSubmit="Save"
  >
    <div style="display: flex; height:400px;" class="form-inline">
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
          tab="Foto"
          class="tab"
          @click="tabId = 'Foto'"
          :class="{
            active: tabId == 'Foto'
          }"
        >
          <v-icon style="font-size:36px;">collections</v-icon>
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
            <Checkbox
              label="Memiliki Tanah"
              :value.sync="forms.TanahLain"
              :text="forms.TanahLain ? 'Memiliki' : 'Tidak Memiliki'"
            />
            <Label label="Ukuran Tanah">
              <Input type="number" placeholder="Panjang" width="81px" />
              <v-icon style="font-size:18px; position:relative; top:-2px;"
                >clear</v-icon
              >
              <Input type="number" placeholder="Lebar" width="81px" />
            </Label>
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
        <div v-show="tabId == 'Foto'">
          <div style="padding-left: 10px; display:flex;">
            <div>
              <div style="padding: 8px 12px; font-size:14px;">
                Foto Calon Lahan
              </div>
              <Uploader :value.sync="forms.RumahDepan">
                <template v-slot="{ opener, uploadedFile }">
                  <div
                    @click="opener"
                    class="upload-image"
                    :style="{
                      width: '150px',
                      height: '150px',
                      'background-image': 'url(' + $api.url + uploadedFile + ')'
                    }"
                  ></div>
                </template>
              </Uploader>
              <div style="padding: 8px 12px; font-size:14px;">
                Foto Calon Lahan
              </div>
              <Uploader :value.sync="forms.RumahSamping">
                <template v-slot="{ opener, uploadedFile }">
                  <div
                    @click="opener"
                    class="upload-image"
                    :style="{
                      width: '150px',
                      height: '150px',
                      'background-image': 'url(' + $api.url + uploadedFile + ')'
                    }"
                  ></div>
                </template>
              </Uploader>
            </div>
            <div style="padding-left:8px">
              <Map
                :lat.sync="forms.GeoLat"
                :lon.sync="forms.GeoLng"
                width="450px"
                height="373px"
              />
            </div>
          </div>
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
      this.$emit("update:show", val);
    },
    noRef() {
      this.populate();
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
        ...this.forms,
        ...this.area
      });
      if (ret.success) this.x_show = false;
      else this.error = ret.message;
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
[tabpanel="Kesehatan"] .tform {
  width: 180px;
}
.tform {
  min-width: 140px;
}
.imgbox {
  width: 150px;
  height: 150px;
  border-right: 1px solid white;
  box-sizing: border-box;
}
</style>
