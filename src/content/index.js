import "./styles.css";

(function() {
  let blacklistedWords = [];
  let blacklistedMap = {};

  function initialize() {
    getMatchingTweets();

    loadWordsFromLocalStorage();

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.command === 'updateWords') {
        blacklistedWords = request.blacklistedWords;
        getMatchingTweets();
        sendResponse({status: "Updated!", blacklistedWords: blacklistedWords});
      }
    });
  }

  function createBlackListMap() {
    var map = {};
    console.log(blacklistedWords);
    blacklistedWords.forEach(function(word) {
      map[word] = true;
    });

    return map;
  }

  function loadWordsFromLocalStorage() {
    var words = localStorage['twittermute.blacklist'] || [];
    if(!(words instanceof Array)) {
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
    [].forEach.call(tweets, (tweet) => {
      var textContent = tweet.textContent.toLowerCase(); // Lowercase everything.
      // Hardcoded problems to test against my own timeline, will be updated in the
      // future.
      blacklistedWords.forEach((word) => {
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
  chrome.runtime.sendMessage({command: 'update'}, (response) => {
    console.log('Asking for an update');
    console.log(response);
    if(response && response.blackListedWords) {  
      blacklistedWords = response.blackListedWords;
    }
  }); 

  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      console.log('Message received!');
      if (request.blacklistedWords) {
        console.log('Updated response!');
        blacklistedWords = request.blacklistedWords;
        getMatchingTweets();
        sendResponse({status: 'Updated!', words: blacklistedWords});
      }
    });

    console.log("init called!");

    initialize();
})();
