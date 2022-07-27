<template>
  <button class="ifly-button">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'ifly-button',
};
</script>

<style lang="less">
.ifly-button {
  min-width: 100px;
  font-size: 14px;
  border: none;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  line-height: 36px;
  cursor: pointer;
  &:hover {
    background: #409eff;
    border-color: #409eff;
    color: #fff; 
  }
}
</style>