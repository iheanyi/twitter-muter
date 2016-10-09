/*eslint no-console: "warn", no-undef: "warn", no-unused-vars: "warn" */

// Watch Tweet Bar event for checking when the View More Tweets button is
// clicked.

//let moreTweetsBar = document.querySelectorAll('.new-tweets-bar')[0];

// Globals for banned words? Load from a JavaScript object/setting/localStorage
// in the future.
import $ from 'jquery';
//import 'styles.css';

(function () {
  let blacklistedWords = ['LinkedIn'];
  //let blacklistedMap = {};

  function initialize() {
    getMatchingTweets();
    /*chrome.runtime.sendMessage({command: 'debug', items: blacklistedWords}, (response) => {
      console.log('Debugging');
      console.log(response);
      });*/

    console.log(localStorage);
    loadWordsFromLocalStorage();
  }

  function createBlackListMap() {
    let map = {};
    console.log(blacklistedWords);
    blacklistedWords.forEach(function (word) {
      map[word] = true;
    });

    return map;
  }

  function loadWordsFromLocalStorage() {
    let words = localStorage['twittermute.blacklist'] || [];
    if (!(words instanceof Array)) {
      console.log(words);
      words = words.split(',');
    }
    console.log(words);
    return words;
  }

  // Initialize list of banned words
  function getMatchingTweets() {
    let tweets = document.querySelectorAll('.tweet-text');
    [].forEach.call(tweets, function (tweet) {
      let textContent = tweet.textContent.toLowerCase(); // Lowercase everything.
      // Hardcoded problems to test against my own timeline, will be updated in the
      // future.
      blacklistedWords.forEach(function (word) {
        if (textContent.indexOf(word.toLowerCase()) > 0) {
          hideTweet(tweet);
        }
      });
    });
  }

  function fetchTweetContainer(tweet) {
    return tweet.parentNode.parentNode.parentNode; // it takes three traversals to get the entire tweet container
  }

  function hideTweet(tweet) {
    // Text Content Tweet.
    let tweetContainer = fetchTweetContainer(tweet);
    let tweetClass = tweetContainer.className.trim('\n');
    let hiddenTweetClass = tweetClass + ' hide-element';

    tweetContainer.className = hiddenTweetClass;
  }

  let numberHiddenTweets = 0;
  let matchingTweets = [];

  // TO-DO: Move this to its own module for the Blacklist, rather than keeping
  // it in popup, mmkay? Create Blacklist Module.

  // Tab send info on load.
  chrome.runtime.sendMessage({ command: 'update' }, function (response) {
    console.log('Asking for an update');
    console.log(response);
    if (response && response.blackListedWords) {
      blacklistedWords = response.blackListedWords;
    }
  });

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('Message received!');
    if (request.blacklistedWords) {
      console.log('Updated response!');
      blacklistedWords = request.blacklistedWords;
      getMatchingTweets();
      sendResponse({ status: 'Updated!', words: blacklistedWords });
    }
  });

  initialize();
})();
