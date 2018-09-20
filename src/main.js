// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import Element from 'element-ui';
import App from './App';
import './styles/_app.scss';
import store from './store';

Vue.config.productionTip = false;
Vue.use(Element);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
});
