<template>
  <div id="app">
    <el-container direction="vertical" v-if="$route.meta.keepAlive">
      <Header></Header>
      <router-view />
      <LeftSide></LeftSide>
    </el-container>
    <div v-else>
      <router-view  />
    </div>
  </div>
</template>

<script>
import header from './views/Header.vue';
import left from './views/LeftSide.vue';

export default {
  name: 'App',
  components: {
    Header: header,
    LeftSide: left,
  }
}
</script>

<style>

body {
  margin: 0px;
  padding: 0px;

}
html {
  font-size: 12.3px;
}
</style>
