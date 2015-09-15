'use strict';

//import Blacklist from './blacklist';

console.log('Before popup created.');

class Popup {
  constructor() {
    this.blacklistedWords = this.loadWordsFromStorage();
    this.blacklistMap = {}; // this.createBlackListMap();
    this.updateBlackListMap();

    // Broadcast to main extension.
    this.broadcastWords();

    this.blacklistWord('test');
    this.blacklistWord('curvin');
    this.tabs = [];

    console.log('Successfully created popup!');

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Heard command!');
      if(request.command === 'update') {
        console.log('Broadcast sent');
        sendResponse({blackListedWords: this.blacklistedWords});
      }

      if(request.tab) {
        // Swag 
      }
    });
  }

  broadcastWords() {
    console.log('Broadcasting to tabs.');
    chrome.tabs.query({active: true, currentWindow: true, url:'*://twitter.com/*'}, (tabs) => {
        tabs.forEach((tab) => {

          chrome.tabs.sendMessage(tab.id, {blacklistedWords: this.blacklistedWords}, function(response) {
            if(response && response.status) {
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


  updateBlackListMap() {
    this.blacklistMap = this.createBlackListMap();
  }

  createBlackListMap() {
    var map = {};
    console.log(this.blacklistedWords);
    this.blacklistedWords.forEach(function(word) {
      map[word] = true;
    }); 

    return map;
  }

  loadWordsFromStorage() {
    var words = localStorage['twittermute.blacklist'] || [];
    if(!(words instanceof Array)) {
      console.log(words);
      console.log(typeof words);
      console.log(words instanceof Array);
      words = words.split(',');

    }
    console.log(words);
    return words;
  }

  blacklistWord(word) {
    if (!localStorage['twittermute.blacklist']) {
      localStorage['twittermute.blacklist'] = this.blacklistedWords; // if undefined, set to our currently blacklisted words.
    }

    let lcWord = word.toLowerCase();
    if(!this.blacklistMap[lcWord]) {
      this.blacklistedWords.push(word.toLowerCase());
    }

    this.updateLocalStorage();
  }

  whitelistWord(word) {
    var lcWord = word.toLowerCase();
    var newArray = this.blacklistedWords.filter(function(item) {
      return item.toLowerCase() !== lcWord; 
    });

    delete this.blacklistMap[lcWord]; // Remove key from the Map.
    this.blacklistedWords = newArray;
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage['twittermute.blacklist'] = this.blacklistedWords;
  }
}

console.log(chrome.tabs);
let popup = new Popup();


//export default Popup;
