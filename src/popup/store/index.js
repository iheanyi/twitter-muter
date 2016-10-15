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

function broadcastWords() {
  console.log('Broadcasting to tabs.');
  chrome.tabs.query({active: true, currentWindow: true, url:'*://twitter.com/*'}, (tabs) => {
    tabs.forEach((tab) => {

      chrome.tabs.sendMessage(tab.id, {
        command: 'updateWords',
        blacklistedWords: state.blacklistedWords}, 
        (response) => {
        console.log('In the Chrome broadcast.');
        console.log(response);
        if(response && response.status) {
          console.log('Status response received');
          console.log(response.status);
          console.log(response);
        } 
      });
    });
  });
}

// Possible mutations that can be applied to the state
const mutations = {
  ADD_WORD(state, { word }) {
    const blacklistedWords = [...state.blacklistedWords];
    let newWords;

    if(blacklistedWords.indexOf(word) === -1) {
      newWords = [
        ...blacklistedWords,
        word
      ];
    } else {
      newWords = blacklistedWords;
    }

    console.log(newWords);

    state.blacklistedWords = newWords;

    localStorage['twittermute.blacklist'] = newWords;
    broadcastWords();
  },
  REMOVE_WORD(state, { word }) {
    const blacklistedWords = [...state.blacklistedWords];

    const newWords =  blacklistedWords.filter((item) => {
      return item.toLowerCase() !== word.toLowerCase();
    });

    state.blacklistedWords = newWords;

    localStorage['twittermute.blacklist'] = newWords;
    broadcastWords();
  }
};

broadcastWords();

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
});
