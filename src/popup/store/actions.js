import * as types from './mutation-types';

export const addWord = ({ commit }, word) => {
  console.log(commit);
  console.log("Adding word!");
  console.log(word);
  commit(types.ADD_WORD, {
    word: word
  });
};

export const removeWord = ({ commit }, word) => {
  commit(types.REMOVE_WORD, {
    word: word
  });
};
