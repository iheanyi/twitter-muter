import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function loadWordsFromStorage() {
  let words = localStorage['twittermute.blacklist'] || [];

  if(!(words instanceof Array)) {
    words = words.split(',');
  }

  return words;
}

// The initial state object
const state = {
  blacklistedWords: loadWordsFromStorage()
};

console.log(state);

// Possible mutations that can be applied to the state
const mutations = {
  ADD_WORD(state) {
    return [
    
    ]
  },
  REMOVE_WORD(state) {
  
  }
};

export default new Vuex.Store({
  state,
  mutations
});

