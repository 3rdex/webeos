<template>
  <div id="app">
    <panel/>
  </div>
</template>

<script>
  import Panel from './pages/Panel';
  import { APIDefinitions } from './services/ResourceService';

  export default {
    name: 'App',
    components: {
      panel: Panel,
    },
    created() {
      APIDefinitions.init();
    },
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
