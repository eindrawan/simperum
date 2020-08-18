<template>
  <div style="min-height:200px;">
    <Select
      label="Kabupaten"
      dbref="Arch.SelArea"
      :value.sync="forms.KabupatenID"
      :text.sync="forms.Kabupaten"
      :dbparams="{ ParentAreaID: 33 }"
    />
    <Select
      label="Kecamatan"
      dbref="Arch.SelArea"
      :value.sync="forms.KecamatanID"
      :text.sync="forms.Kecamatan"
      :dbparams="kecamatanParams"
    />
    <Select
      label="Kelurahan"
      dbref="Arch.SelArea"
      :text.sync="forms.Kecamatan"
      :dbparams="{ ParentAreaID: forms.KecamatanID }"
    />
  </div>
</template>
<script>
export default {
  data: () => ({
    forms: {}
  }),
  props: {
    value: Object
  },
  computed: {
    kecamatanParams() {
      return { ParentAreaID: this.forms.KabupatenID };
    }
  }
};
</script>
