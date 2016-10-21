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
let state = {
  blacklistedWords: loadWordsFromStorage()
};

function broadcastWords() {
  chrome.tabs.query({active: true, currentWindow: true, url:'*://twitter.com/*'}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, {
        command: 'updateWords',
        blacklistedWords: state.blacklistedWords}, 
        (response) => {
          if(response && response.status) {
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
    const wordsState = state.blacklistedWords || [];
    const blacklistedWords = [...wordsState];
    let newWords;

    if(blacklistedWords.indexOf(word) === -1) {
      newWords = [
        ...blacklistedWords,
        word
      ];
    } else {
      newWords = blacklistedWords;
    }

    state.blacklistedWords = newWords;

    localStorage['twittermute.blacklist'] = newWords;
    broadcastWords();
    chrome.storage.sync.set({'twitterBlacklist': newWords}, () => {
    });
  },
  REMOVE_WORD(state, { word }) {
    const blacklistedWords = [...state.blacklistedWords];

    const newWords =  blacklistedWords.filter((item) => {
      return item !== word;
    });

    state.blacklistedWords = newWords;

    localStorage['twittermute.blacklist'] = newWords;
    broadcastWords();
    chrome.storage.sync.set({'twitterBlacklist': newWords}, () => {
    });
  },
  LOAD_INITIAL(state, { items }) {
    state.blacklistedWords = items;
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
