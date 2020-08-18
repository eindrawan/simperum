<template>
  <div col>
    <a @click="handleSort">
      <slot />
    </a>
    <v-icon>{{ sortIcon }}</v-icon>
  </div>
</template>

<script>
//import Vue from "vue";

export default {
  name: "hcol",
  data: () => {
    return {
      isSort: ""
    };
  },
  computed: {
    sortIcon() {
      switch (this.isSort) {
        case "":
          return "";
        case "asc":
          return "arrow_drop_up";
        case "desc":
          return "arrow_drop_down";
        default:
          return "";
      }
    }
  },
  methods: {
    handleSort() {
      this.$parent.$emit("sort");
      switch (this.isSort) {
        case "":
          this.isSort = "asc";
          break;
        case "asc":
          this.isSort = "desc";
          break;
        case "desc":
          this.isSort = "";
          break;
      }
    }
  }
};
</script>
<style lang="scss"></style>
