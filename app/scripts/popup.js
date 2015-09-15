'use strict';

//import Blacklist from './blacklist';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

console.log('Before popup created.');

var Popup = (function () {
  function Popup() {
    var _this = this;

    _classCallCheck(this, Popup);

    this.blacklistedWords = this.loadWordsFromStorage();
    this.blacklistMap = {}; // this.createBlackListMap();
    this.updateBlackListMap();

    // Broadcast to main extension.
    this.broadcastWords();

    this.blacklistWord('test');
    this.blacklistWord('curvin');
    this.tabs = [];

    console.log('Successfully created popup!');

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      console.log('Heard command!');
      if (request.command === 'update') {
        console.log('Broadcast sent');
        sendResponse({ blackListedWords: _this.blacklistedWords });
      }

      if (request.tab) {
        // Swag
      }
    });
  }

  _createClass(Popup, [{
    key: 'broadcastWords',
    value: function broadcastWords() {
      var _this2 = this;

      console.log('Broadcasting to tabs.');
      chrome.tabs.query({ active: true, currentWindow: true, url: '*://twitter.com/*' }, function (tabs) {
        tabs.forEach(function (tab) {

          chrome.tabs.sendMessage(tab.id, { blacklistedWords: _this2.blacklistedWords }, function (response) {
            if (response && response.status) {
              console.log('Status response received');
              console.log(response.status);
              console.log(response);
            }
          });
        });
      });

      /*chrome.runtime.sendMessage({blacklistedWords: this.blacklistedWords}, function(response) {
        console.log(response.status);
        });*/
    }
  }, {
    key: 'updateBlackListMap',
    value: function updateBlackListMap() {
      this.blacklistMap = this.createBlackListMap();
    }
  }, {
    key: 'createBlackListMap',
    value: function createBlackListMap() {
      var map = {};
      console.log(this.blacklistedWords);
      this.blacklistedWords.forEach(function (word) {
        map[word] = true;
      });

      return map;
    }
  }, {
    key: 'loadWordsFromStorage',
    value: function loadWordsFromStorage() {
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
  }, {
    key: 'blacklistWord',
    value: function blacklistWord(word) {
      if (!localStorage['twittermute.blacklist']) {
        localStorage['twittermute.blacklist'] = this.blacklistedWords; // if undefined, set to our currently blacklisted words.
      }

      var lcWord = word.toLowerCase();
      if (!this.blacklistMap[lcWord]) {
        this.blacklistedWords.push(word.toLowerCase());
      }

      this.updateLocalStorage();
    }
  }, {
    key: 'whitelistWord',
    value: function whitelistWord(word) {
      var lcWord = word.toLowerCase();
      var newArray = this.blacklistedWords.filter(function (item) {
        return item.toLowerCase() !== lcWord;
      });

      delete this.blacklistMap[lcWord]; // Remove key from the Map.
      this.blacklistedWords = newArray;
      this.updateLocalStorage();
    }
  }, {
    key: 'updateLocalStorage',
    value: function updateLocalStorage() {
      localStorage['twittermute.blacklist'] = this.blacklistedWords;
    }
  }]);

  return Popup;
})();

console.log(chrome.tabs);
var popup = new Popup();

//export default Popup;
//# sourceMappingURL=popup.js.map
