<template>
  <div
    :id="targetId + '_popover'"
    class="ui-popover"
    v-show="isShow || show"
    @click="handleClick"
    v-click-outside="handleClickOutside"
  >
    <slot>
      ...
    </slot>
  </div>
</template>
<script>
export default {
  data: () => ({
    isShow: false
  }),
  props: {
    targetId: String,
    on: String,
    show: Boolean
  },
  watch: {
    isShow() {
      this.$emit("update:show", this.isShow);
    }
  },
  mounted() {
    if (this.targetId) {
      let $el = document.getElementById(this.targetId);
      if ($el) $el.addEventListener(this.on, this.handleShow);
    }
  },
  methods: {
    handleShow(evt) {
      let $this = document.getElementById(this.targetId + "_popover");
      if (this.on == "contextmenu") {
        $this.style.top = evt.layerY + "px";
        $this.style.left = evt.layerX + "px";
        evt.preventDefault();
      }
      this.isShow = true;
      this.$emit("onShow", $this);
    },
    handleClick(evt) {
      let $this = document.getElementById(this.id + "_popover");
      if (
        evt.target.closest(".popover-close") ||
        evt.target.classList.contains("popover-close")
      ) {
        this.isShow = false;
        this.$emit("onHide", $this);
      }
    },
    handleClickOutside(evt) {
      let $this = document.getElementById(this.id + "_popover");
      if (
        evt.target.getAttribute("id") == this.targetId ||
        evt.target.closest("#" + this.targetId)
      ) {
        // this.isShow = true;
      } else {
        this.isShow = false;
        this.$emit("onHide", $this);
      }
    }
  }
};
</script>
<style lang="scss">
.ui-popover {
  position: absolute;
  background: white;
  z-index: 100;
}
</style>
