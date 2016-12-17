import Vue from 'vue';
import App from './App.vue'
import store from './store/index';
import 'tachyons';
import 'css-cursors';

require('file?name=_locales/en/messages.json!../_locales/en/messages.json');
require('file?name=manifest.json!../manifest.json');
require('file?name=icon38.png!./images/icon-38.png');
require('file?name=icon48.png!./images/icon-48.png');
require('file?name=icon19.png!./images/icon-19.png');
require('file?name=icon128.png!./images/icon-128.png');
require('file?name=icon16.png!./images/icon-16.png');

new Vue({
  store,
  el: '#app',
  render: h => h(App)
});
