<template>
  <div class="form-coms">
    <div class="form-label" v-if="$attrs.label">{{ $attrs.label }}</div>
    <div class="--input">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss">
.form-coms {
  margin-bottom: 8px;

  .form-label {
    text-align: left;
    font-size: 14px;
  }

  .--input {
    display: flex;
  }
}
</style>
