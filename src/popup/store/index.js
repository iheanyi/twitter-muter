import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import * as actions from './actions';

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

// Possible mutations that can be applied to the state
const mutations = {
  ADD_WORD(state, { word }) {
    const blacklistedWords = [...state.blacklistedWords];
    let newWords;

    if(~blacklistedWords.indexOf(word)) {
      newWords = blacklistedWords;
    } else {
      newWords = [
        ...blacklistedWords,
        word
      ];
    }

    state.blacklistedWords = newWords;
  },
  REMOVE_WORD(state, { word }) {
    const blacklistedWords = [...state.blacklistedWords];

    const newWords =  blacklistedWords.filter((item) => {
      return item.toLowerCase() !== word.toLowerCase();
    });

    state.blacklistedWords = newWords;
  }
};

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
});
