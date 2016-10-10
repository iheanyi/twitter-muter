<template>
  <div id="app">

  <h1>Add Words</h1>
      <ul>
        <li v-for="(word, index) in blacklistedWords">
          <span class="mr1 pv2 dib">{{word}}</span>
          <button v-on:click="removeWord(index)" class="fr white bg-red bn">-</button>
        </li>
      </ul>

      <div class="db">
        <form v-on:submit="addWord">
          <input v-model="bannedWord" placeholder="Add Banned Word">
          <button v-on:click="addWord" class="bg-blue white fr bn">+</button>
        </form>
      </div>
  </div>
</template>

<script>
let blacklistedWords = [];
let blacklistedMap = {};

function initialize() {
  console.log('Initialized!');
  blacklistedWords = loadWordsFromStorage();
  blacklistedMap = {}; // createBlackListMap();
  let tabs = [];
  updateBlackListMap();
  // Broadcast to main extension.
  broadcastWords();

  blacklistWord('test');
  blacklistWord('curvin');
  blacklistWord('dog');

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.command === 'update') {
      sendResponse({blackListedWords: blacklistedWords});
    }

    if(request.command === 'debug') {
      console.log(request);
      console.log(sendResponse({gucci: 'bandana'}));
    }
  });

  broadcastWords();
  let app = new Vue({
    el: '#app',
    data: {
      blacklistedWords: blacklistedWords,
      bannedWord: ''
    },
    methods: {
      addWord: function() {
        console.log('Adding a new banned word: ' + this.bannedWord);
        blacklistWord(this.bannedWord);
        // Reset input.
        this.bannedWord = '';
        updateLocalStorage();
      },
      removeWord: function(index) {
        blacklistedWords.splice(index, 1);
        updateLocalStorage();
      }
    }
  });
}

function broadcastWords() {
  console.log('Broadcasting to tabs.');
  chrome.tabs.query({active: true, currentWindow: true, url:'*://twitter.com/*'}, (tabs) => {
    tabs.forEach((tab) => {

      chrome.tabs.sendMessage(tab.id, {blacklistedWords: blacklistedWords}, function(response) {
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


function updateBlackListMap() {
  blacklistedMap = createBlackListMap();
}

function createBlackListMap() {
  var map = {};
  console.log(blacklistedWords);
  blacklistedWords.forEach(function(word) {
    map[word] = true;
  }); 

  return map;
}

function loadWordsFromStorage() {
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

function blacklistWord(word) {
  if (!localStorage['twittermute.blacklist']) {
    localStorage['twittermute.blacklist'] = blacklistedWords; // if undefined, set to our currently blacklisted words.
  }

  let lcWord = word.toLowerCase();
  if(!blacklistedMap[lcWord]) {
    blacklistedWords.push(word.toLowerCase());
  }

  updateLocalStorage();
}

function whitelistWord(word) {
  var lcWord = word.toLowerCase();
  var newArray = blacklistedWords.filter(function(item) {
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

export default {
  data () {
    return {
      msg: 'Hello Vue!'
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
