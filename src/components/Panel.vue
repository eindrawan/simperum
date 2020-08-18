<template>
  <div class="panel">
    <slot :data="data" :first="first"></slot>
  </div>
</template>
<script>
export default {
  data: () => ({
    data: [],
    first: {},
    oldparams: null
  }),
  props: {
    dbref: String,
    dbparams: [Object, Array],
    autobind: { type: Boolean, default: true }
  },
  created() {
    if (this.autobind) this.populate();
  },
  watch: {
    dbparams(val) {
      console.log(val);
      if (JSON.stringify(val) != this.oldparams) {
        this.populate();
        this.oldparams = JSON.stringify(val);
      }
    }
  },
  methods: {
    async populate() {
      let { data } = await this.$api.post(
        this.$api.url + "/api/call/" + this.dbref.replace(".", "_"),
        this.dbparams
      );
      this.data = data || [];
      this.first = data.length ? data[0] : {};
    }
  }
};
</script>
<style lang="scss"></style>
