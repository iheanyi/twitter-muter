//'use strict';

'use strict';

(function () {
  var blacklistedWords = [];
  var blacklistedMap = {};

  function initialize() {
    console.log('Initialized!');
    blacklistedWords = loadWordsFromStorage();
    blacklistedMap = {}; // createBlackListMap();
    var tabs = [];
    updateBlackListMap();
    // Broadcast to main extension.
    broadcastWords();

    blacklistWord('test');
    blacklistWord('curvin');
    blacklistWord('dog');

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.command === 'update') {
        sendResponse({ blackListedWords: blacklistedWords });
      }

      if (request.command === 'debug') {
        console.log(request);
        console.log(sendResponse({ gucci: 'bandana' }));
      }
    });

    broadcastWords();
    var app = new Vue({
      el: '#app',
      data: {
        blacklistedWords: blacklistedWords,
        bannedWord: ''
      },
      methods: {
        addWord: function addWord() {
          console.log('Adding a new banned word: ' + this.bannedWord);
          blacklistWord(this.bannedWord);
          // Reset input.
          this.bannedWord = '';
          updateLocalStorage();
          broadcastWords();
        },
        removeWord: function removeWord(index) {
          blacklistedWords.splice(index, 1);
          updateLocalStorage();
          broadcastWords();
        }
      }
    });
  }

  function broadcastWords() {
    console.log('Broadcasting to tabs.');
    chrome.tabs.query({ active: true, currentWindow: true, url: '*://twitter.com/*' }, function (tabs) {
      tabs.forEach(function (tab) {

        chrome.tabs.sendMessage(tab.id, { blacklistedWords: blacklistedWords }, function (response) {
          console.log('In the Chrome broadcast.');
          console.log(response);
          if (response && response.status) {
            console.log('Status response received');
            console.log(response.status);
            console.log(response);
          }
        });
      });
    });
  }

  function updateBlackListMap() {
    blacklistedMap = createBlackListMap();
  }

  function createBlackListMap() {
    var map = {};
    console.log(blacklistedWords);
    blacklistedWords.forEach(function (word) {
      map[word] = true;
    });

    return map;
  }

  function loadWordsFromStorage() {
    var words = localStorage['twittermute.blacklist'] || [];
    if (!(words instanceof Array)) {
      console.log(words);
      console.log(typeof words);
      console.log(words instanceof Array);
      words = words.split(',');
    }
    console.log(words);
    return words;
  }

  function blacklistWord(word) {
    if (!localStorage['twittermute.blacklist']) {
      localStorage['twittermute.blacklist'] = blacklistedWords; // if undefined, set to our currently blacklisted words.
    }

    var lcWord = word.toLowerCase();
    if (!blacklistedMap[lcWord]) {
      blacklistedWords.push(word.toLowerCase());
    }

    updateLocalStorage();
  }

  function whitelistWord(word) {
    var lcWord = word.toLowerCase();
    var newArray = blacklistedWords.filter(function (item) {
      return item.toLowerCase() !== lcWord;
    });

    delete blacklistedMap[lcWord]; // Remove key from the Map.
    blacklistedWords = newArray;
    updateLocalStorage();
  }

  function updateLocalStorage() {
    localStorage['twittermute.blacklist'] = blacklistedWords;
  }

  document.addEventListener('DOMContentLoaded', function () {
    initialize();
  });
})();
//# sourceMappingURL=popup.js.map
