import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';

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
    const blacklistedWords = [...state.blacklistedWords];

    if(~blacklistedWords.indexOf(word)) {
      return [
        ...blacklistedWords,
        word
      ];
    } else {
      return blacklistedWords;
    }
  },
  REMOVE_WORD(state) {
    const blacklistedWords = [...state.blacklistedWords];

    return blacklistedWords.filter((item) => {
      return item.toLowerCase() !== word.toLowerCase();
    })
  }
};

export default new Vuex.Store({
  state,
  mutations,
  getters
});
