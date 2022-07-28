<template>
  <button class="ifly-button" :class="getClass()">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'ifly-button',
  props: {
    type: {
      type: String,
      default: 'info',
    },
  },
  methods: {
    getClass() {
      console.log(444, this.type);
      switch (this.type) {
        case 'primary':
          return 'ifly-button--primary';
        case 'info':
          return 'ifly-button--info';
        case 'error':
          return 'ifly-button--error';
      }
    },
  },
};
</script>

<style lang="less" scoped>
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
.ifly-button--primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
</style>