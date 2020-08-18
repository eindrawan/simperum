<template>
  <v-dialog v-model="show" :persistent="showActions">
    <v-card :class="id">
      <v-card-title class="headline">{{ title }}</v-card-title>
      <div class="v-dialog--error" v-show="error">
        {{ error }}
      </div>
      <div class="v-dialog--content" :class="{ '--loading': loading }">
        <slot> </slot>
      </div>

      <v-card-actions v-if="showActions">
        <slot name="left-action"> </slot>
        <v-spacer></v-spacer>
        <v-btn v-if="cancelText" color="disabled" text @click="Cancel">
          {{ cancelText }}
        </v-btn>
        <v-btn color="green darken-2" text @click="Submit">
          {{ submitText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    show: Boolean,
    error: String,
    title: String,
    loading: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: "Batal"
    },
    submitText: {
      type: String,
      default: "Simpan"
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    id() {
      return "modal-" + this.title.toLowerCase().replace(" ", "-");
    }
  },
  watch: {
    show(val) {
      if (val) {
        document.querySelector(".v-application--wrap").style.filter =
          "blur(4px)";
      } else {
        document.querySelector(".v-application--wrap").style.filter = "none";
        this.$emit("update:show", val);
      }
    }
  },
  methods: {
    Submit() {
      this.$emit("onSubmit");
    },
    Cancel() {
      this.$emit("update:show", false);
      this.$emit("onCancel");
    }
  }
};
</script>
<style lang="scss">
.v-dialog {
  width: auto !important;
  overflow: hidden !important;
  &--error {
    background: orangered;
    color: white;
    padding: 10px;
    text-align: center;
    font-size: 14px;
  }
  &--content {
    padding: 0 20px;
    max-height: calc(100vh - 200px);
    overflow: auto;

    &.--loading {
      filter: blur(4px);
    }
  }
  .page-header {
    display: none;
  }
}
</style>
