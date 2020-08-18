<template>
  <div class="form-coms ui-checkbox">
    <div class="form-label" v-if="$attrs.label">{{ $attrs.label }}</div>
    <div class="--base" @click="handleClick()">
      <v-icon class="--box" :class="{ checked: value }">{{ icon }}</v-icon>
      <div class="--text" v-if="text">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Checkbox",
  data: () => ({
    checked: false
  }),
  props: {
    value: [String, Number, Boolean],
    text: String,
    disabled: Boolean,
    checkedIcon: {
      type: String,
      default: "mdi-check-box-outline"
    },
    uncheckedIcon: {
      type: String,
      default: "mdi-crop-square"
    },
    disabledIcon: String,
    width: String
  },
  computed: {
    icon() {
      // if (typeof this.value == "string")
      //   return this.value == "checked" ? this.checkedIcon : this.uncheckedIcon;
      // else return
      return this.value
        ? this.disabled && this.disabledIcon
          ? this.disabledIcon
          : this.checkedIcon
        : this.disabled && this.disabledIcon
        ? this.disabledIcon + "-outline"
        : this.uncheckedIcon;
    }
  },
  mounted() {
    this.checked = this.value;
  },
  methods: {
    handleClick() {
      if (this.disabled) return;
      this.checked = !this.value;

      this.$emit("onClick", this.checked, this.afterClick);
      this.$emit("update:value", this.checked);
    },
    afterClick(retval) {
      if (retval === false) {
        this.checked = !this.checked;
        this.$emit("update:value", this.checked);
      }
    }
  }
};
</script>
<style lang="scss">
.ui-checkbox {
  margin-bottom: 8px;
  .inline {
    display: flex;
    .form-label {
      width: 200px;
      padding: 3px 0;
    }
  }
  .--base {
    display: flex;
    cursor: pointer;

    .--text {
      margin-left: 8px;
      font-size: 14px;
      margin-top: 2px;
    }
  }
}
</style>
