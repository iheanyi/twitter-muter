//'use strict';

// Watch Tweet Bar event for checking when the View More Tweets button is
// clicked.

//var moreTweetsBar = document.querySelectorAll('.new-tweets-bar')[0];

// Globals for banned words? Load from a JavaScript object/setting/localStorage
// in the future.

'use strict';

(function () {
  var blacklistedWords = ['LinkedIn'];
  var blacklistedMap = {};

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
    var map = {};
    console.log(blacklistedWords);
    blacklistedWords.forEach(function (word) {
      map[word] = true;
    });

    return map;
  }

  function loadWordsFromLocalStorage() {
    var words = localStorage['twittermute.blacklist'] || [];
    if (!(words instanceof Array)) {
      console.log('Debugging words from local storage.');
      console.log(words);
      console.log(typeof words);
      console.log(words instanceof Array);
      words = words.split(',');
    }
    console.log(words);
    return words;
  }

  // Initialize list of banned words
  function getMatchingTweets() {
    var tweets = document.querySelectorAll('.tweet-text');
    [].forEach.call(tweets, function (tweet) {
      var textContent = tweet.textContent.toLowerCase(); // Lowercase everything.
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
    var tweetContainer = fetchTweetContainer(tweet);
    var tweetClass = tweetContainer.className.trim('\n');
    var hiddenTweetClass = tweetClass + ' hide-element';

    tweetContainer.className = hiddenTweetClass;
  }

  var numberHiddenTweets = 0;
  var matchingTweets = [];

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
//# sourceMappingURL=contentscript.js.map
