<template>
  <div
    :class="{
      page: true,
      [classId]: true
    }"
  >
    <div class="page-header">
      <div class="page-title">{{ title }}</div>
      <div class="page-toolbar">
        <slot name="toolbar"> </slot>
      </div>
    </div>
    <div class="page-content" :class="{ 'has-sidebar': sidebar }">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    sidebar: Boolean
  },
  computed: {
    classId() {
      return this.title
        ? "page-" + this.title.toLowerCase().replace(/\s/g, "-")
        : "";
    }
  }
};
</script>
<style lang="scss">
.page {
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.5);
  &-header {
    padding: 15px 15px;
    display: flex;

    .page-title {
      font-family: Raleway;
      line-height: 20px;
      font-size: 30px;
      flex: 1;
    }
    .page-toolbar {
      flex: 1;
      text-align: right;

      & > * {
        margin-left: 10px;
      }
    }
  }
  &-content {
    height: calc(100vh - 106px);
    min-width: 1280px;
    overflow: hidden;
    &.has-sidebar {
      display: flex;
      & > div:first-child {
        flex: 0 0 340px;
      }
      & > div:nth-child(2) {
        flex: 0 0 calc(100vw - 350px);
      }
    }
  }
}
</style>
