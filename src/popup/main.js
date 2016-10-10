import Vue from 'vue';
//import 'tachyons';
import App from './App.vue'
//import App from './App';
import store from './vuex/store';

require('file?name=manifest.json!../manifest.json');
require('file?name=icon-38.png!./images/icon-38.png');
require('file?name=icon-38.png!./images/icon-38.png');
require('file?name=icon-19.png!./images/icon-19.png');
require('file?name=icon-128.png!./images/icon-128.png');
require('file?name=icon-16.png!./images/icon-16.png');

new Vue({
  store,
  el: '#app',
  render: h => h(App)
});
