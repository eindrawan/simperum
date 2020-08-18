<template>
  <div class="form-coms ui-textarea">
    <div class="form-label" v-if="$attrs.label">{{ $attrs.label }}</div>
    <textarea
      v-bind="$attrs"
      v-model="vmodel"
      :style="{
        width: width
      }"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: "Input",
  data: () => ({
    val: ""
  }),
  props: {
    value: String,
    width: {
      type: String,
      default: "180px"
    }
  },
  computed: {
    vmodel: {
      get() {
        return this.val;
      },
      set(val) {
        this.val = val;
        this.$emit("update:value", val);
      }
    }
  },
  watch: {
    value(val) {
      this.val = val;
    }
  }
};
</script>
<style lang="scss">
.ui-textarea {
  margin-bottom: 8px;
  font-size: 14px;

  .form-label {
    text-align: left;
    font-size: 14px;
  }
  textarea {
    padding: 3px 5px;
    background: rgba(200, 200, 200, 0.2);
    border-radius: 2px;
    border-bottom: 1px solid silver;
    height: calc(100% - 10px);

    &:hover,
    &:focus {
      border: 0;
      background: rgba(200, 200, 200, 0.4);
      border-bottom: 1px solid gray;
    }
  }
}
</style>
