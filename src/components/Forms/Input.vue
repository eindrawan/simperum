<template>
  <div class="form-coms ui-input">
    <div class="form-label" v-if="$attrs.label">{{ $attrs.label }}</div>
    <div
      class="--input"
      :style="{
        width: width
      }"
    >
      <v-icon left v-if="leftIcon">{{ leftIcon }}</v-icon>
      <input
        :type="type"
        v-bind="$attrs"
        v-model="vmodel"
        @blur="handleBlur($event)"
        @change="handleChange($event)"
        :style="{
          'margin-left': leftIcon ? '-36px' : undefined,
          'padding-left': leftIcon ? '30px' : undefined,
          'padding-right': rightIcon ? '30px' : undefined
        }"
      />
      <v-icon right v-if="rightIcon">{{ rightIcon }}</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "Input",
  data: () => ({
    val: "",
    timeoutTracker: null
  }),
  props: {
    value: [String, Number],
    width: String,
    leftIcon: String,
    rightIcon: String,
    type: {
      type: String,
      default: "text"
    }
  },
  computed: {
    vmodel: {
      get() {
        return this.val;
      },
      set(val) {
        this.val = val;
        if (this.rightIcon == "search") {
          clearTimeout(this.timeoutTracker);
          this.timeoutTracker = setTimeout(
            function() {
              this.$emit("update:value", val);
            }.bind(this),
            800
          );
        } else {
          this.$emit("update:value", val);
        }
      }
    }
  },
  watch: {
    value(val) {
      this.val = val;
    }
  },
  methods: {
    handleBlur(evt) {
      this.$emit("blur", evt);
    },
    handleChange(evt) {
      this.$emit("change", evt);
    }
  }
};
</script>
<style lang="scss">
.ui-input {
  margin-bottom: 8px;
  font-size: 14px;

  .form-label {
    text-align: left;
  }
  .--input {
    width: 180px;
    input {
      padding: 3px 5px;
      background: rgba(200, 200, 200, 0.2);
      border-radius: 2px;
      border-bottom: 1px solid silver;
      width: 100%;

      &:hover,
      &:focus {
        border: 0;
        background: rgba(200, 200, 200, 0.4);
        border-bottom: 1px solid gray;
      }
    }
    .v-icon--right {
      margin-left: 5px;
    }
    .v-icon--right {
      margin-left: -25px;
    }
  }
}
.dense {
  .ui-input {
    font-size: 14px;
  }
}
</style>
