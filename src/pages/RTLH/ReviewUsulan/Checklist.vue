<template>
  <Modal
    title="CHECKLIST PROPOSAL"
    :show.sync="xshow"
    width="500px"
    @onSubmit="Save"
  >
    <div style="display: flex;" class="form-inline">
      <div class="iblock" style="width:250px;">
        <div style="padding:0px; font-weight: bold;">CHECKLIST</div>
        <div style="padding:5px;">
          <Checkbox text="Rencana Kegiatan" :value.sync="forms.CekProposal" />
          <Checkbox text="Berita Acara" :value.sync="forms.CekBeritaAcara" />
          <Checkbox text="Daftar Hadir" :value.sync="forms.CekDaftarHadir" />
          <Checkbox
            text="Surat Pernyataan Kades"
            :value.sync="forms.CekSuratSwadaya"
          />
          <Checkbox text="Foto 0% Depan" :value.sync="forms.CekFotoDepan" />
          <Checkbox text="Foto 0% Samping" :value.sync="forms.CekFotoSamping" />
          <Checkbox
            text="Koordinat Penerima"
            :value.sync="forms.CekKoordinat"
          />
        </div>
      </div>
      <div class="iblock dv-kerusakan" style="width:250px;">
        <div style="padding:0px; font-weight: bold;">DATA KERUSAKAN</div>
        <div style="padding:5px;">
          <Checkbox
            label="Atap"
            checkedIcon="mdi-home-remove"
            :value.sync="forms.AtapTdkLayak"
          />
          <Checkbox
            label="Laintai"
            checkedIcon="mdi-home-remove"
            :value.sync="forms.LaintaiTdkLayak"
          />
          <Checkbox
            label="Dinding"
            checkedIcon="mdi-home-remove"
            :value.sync="forms.DindingTdkLayak"
          />
          <Checkbox
            label="Pencahayaan"
            checkedIcon="mdi-home-remove"
            :value.sync="forms.CahayaTdkLayak"
          />
          <Checkbox
            label="Km. Mandi/Jamban"
            checkedIcon="mdi-home-remove"
            :value.sync="forms.JambanTdkLayak"
          />
          <Checkbox
            label="Listrik"
            checkedIcon="mdi-home-remove"
            :value.sync="forms.ListrikTdkLayak"
          />
        </div>
      </div>
    </div>
    <template v-slot:left-action>
      <div style="padding-left: 17px; color: gray;">
        <Checkbox text="Check Semua" :value.sync="checkAll" />
      </div>
    </template>
  </Modal>
</template>
<script>
export default {
  data: () => ({
    xshow: false,
    forms: {},
    checkAll: false
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
      this.$emit("update:show", val);
    },
    nik(val) {
      if (val && this.xshow) this.populate();
    },
    checkAll(val) {
      for (let x in this.forms) {
        if (x.match(/^Cek/)) this.forms[x] = val;
      }
    }
  },
  methods: {
    async populate() {
      let { data } = await this.$api.call("PRM.SelProposalCheck", {
        NIK: this.nik
      });
      this.forms = data[0];
    },
    async Save() {
      let ret = await this.$api.call("PRM.SavProposalCheck", {
        ...this.forms,
        NIK: this.nik
      });
      if (ret.success) this.$emit("update:show", false);
    }
  }
};
</script>
<style lang="scss">
.dv-kerusakan .checked {
  color: red;
}
</style>
