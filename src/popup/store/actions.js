import * as types from './mutation-types';

export const addWord = ({ commit }, word) => {
  commit(types.ADD_WORD, {
    word: word
  });
};

export const removeWord = ({ commit }, word) => {
  commit(types.REMOVE_WORD, {
    word: word
  });
};

export const loadInitial = ({ commit }) => {
  chrome.storage.sync.get('twitterBlacklist', ({ twitterBlacklist: items }) => {
    commit(types.LOAD_INITIAL, {
      items
    });
  });
};
