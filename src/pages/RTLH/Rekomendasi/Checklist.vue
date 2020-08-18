<template>
  <Modal
    title="CHECKLIST REKOM"
    :show.sync="xshow"
    width="400px"
    @onSubmit="Save"
  >
    <div style="display: flex;" class="form-inline">
      <div class="iblock" style="width:350px;">
        <div style="padding:5px;">
          <Checkbox
            text="Berkas Pencairan o/ Kabupaten"
            :value.sync="forms.CekCairBerkas"
          />
          <Checkbox
            text="Permohonan Pencairan o/ Desa"
            :value.sync="forms.CekCairPermohonan"
          />
          <Checkbox text="Kwitansi" :value.sync="forms.CekCairKwitansi" />
          <Checkbox
            text="FC Rekening Bank"
            :value.sync="forms.CekCairRekBank"
          />
          <Checkbox
            text="FC KTP Kepala + Bendahara Desa"
            :value.sync="forms.CekCairKTP"
          />
          <Checkbox
            text="Surat Kesanggupan Kepala Desa"
            style="width:300px"
            :value.sync="forms.CekCairSK"
          />
          <Checkbox
            text="Surat Kaur/Kasi Pemerintahan Desa"
            :value.sync="forms.CekCairSK2"
          />
          <Checkbox
            text="Harga Satuan Bahan & Alat"
            :value.sync="forms.CekCairHarga"
          />
          <Checkbox
            text="Rencana Penggunaan Dana"
            :value.sync="forms.CekCairRPD"
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
      if (val) this.populate();
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
      let ret = await this.$api.call("PRM.SavRekomCheck", {
        ...this.forms,
        NIK: this.nik
      });
      if (ret.success) this.$emit("update:show", false);
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
