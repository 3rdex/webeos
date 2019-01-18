<style scoped lang="scss">
  .api-title-container {
    display: flex;
    align-items: center;
    height: 100%;
    border-radius: 4px;
    padding-left: 12px;
  }

  .summary {
    display: flex;
    align-items: center;
    font-size: 14px;
    height: 32px;
    .action {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      background: #61affe;
      margin-right: 12px;
      font-weight: bold;
      min-width: 80px;
      border-radius: 3px;
      text-shadow: 0 1px 0 rgba(0, 0, 0, .1);
      padding-left:4px;
      padding-right:4px;
    }
    .path {
      margin-right: 20px;
      font-weight: bold;
    }
    .description {

    }
  }
</style>
<template>
  <div class='api-title-container'>
    <div class="summary">
      <div class="action">{{action}}</div>
      <div class="path">{{path}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ApiTitle',
    props: {
      action: {
        type: String,
        required: true,
        default: 'GET',
      },
      path: {
        type: String,
        required: true,
        default: '/',
      },
    },
  };
</script>

