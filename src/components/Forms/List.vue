<template>
  <div
    class="ui-list"
    :style="{
      height: height
    }"
  >
    <div
      class="--item"
      :class="{ selected: selectedIndex === idx }"
      v-for="(item, idx) in items || datalist"
      :key="idx"
      v-show="!filteredIndexes.length || filteredIndexes[idx]"
      @click="ItemClick(item, idx)"
    >
      <slot :row="item">
        {{ item }}
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    datalist: [],
    selectedIndex: null,
    filteredIndexes: [],

    x_dbparams: null
  }),
  props: {
    items: Array,
    selectedItem: [Object, String],
    dbref: String,
    dbparams: Object,
    rebind: Number,
    height: String,
    filters: Object,
    selectOnLoad: Boolean
  },
  watch: {
    rebind(val) {
      if (val > 0) {
        this.dbRebind();
      }
    },
    dbparams(val) {
      if (JSON.stringify(val) != this.x_dbparams) {
        this.x_dbparams = JSON.stringify(val);
        this.dbRebind();
      }
    },
    filters() {
      this.doFilter();
    }
  },
  created() {
    this.dbRebind();
  },
  methods: {
    async dbRebind() {
      if (this.dbparams) {
        let { data } = await this.$api.call(this.dbref, this.dbparams);
        this.datalist = data;
        this.$emit("update:items", data);
        if (this.selectedIndex && this.selectedIndex < data.length) {
          this.ItemClick(data[this.selectedIndex], this.selectedIndex);
        }
      }
    },
    doFilter() {
      if (!this.filters) return;

      this.filteredIndexes = [];
      (this.items || this.datalist).map((item, idx) => {
        this.filteredIndexes.push(this.filters.filter(item, idx));
      });
      // console.log(this.filteredIndexes);
    },
    ItemClick(item, idx) {
      this.selectedIndex = idx;
      this.$emit("itemClick", item, idx);
      this.$emit("update:selectedItem", item);
    }
  }
};
</script>
<style lang="scss">
.ui-list {
  overflow: auto;
  .--item {
    cursor: pointer;
    &.selected {
      background: #ddd;
    }
  }
}
</style>
