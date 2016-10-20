import "./styles.css";

(function() {
  let blacklistedWords = [];
  let blacklistedMap = {};

  function initialize() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.command === 'updateWords') {
        blacklistedWords = request.blacklistedWords;
        getMatchingTweets();
        sendResponse({status: "Updated!", blacklistedWords: blacklistedWords});
      }
    });

    chrome.storage.sync.get('twitterBlacklist', ({ twitterBlacklist: items }) => {
      blacklistedWords = items;
      getMatchingTweets();
    });

    console.log("Setting up mutations.");
    let target = document.getElementById('stream-items-id');

    let observer = new MutationObserver(function(mutations) {
      getMatchingTweets();
    });

    const config = { childList: true };
    observer.observe(target, config);
  }

  function createBlackListMap() {
    var map = {};
    blacklistedWords.forEach(function(word) {
      map[word] = true;
    });

    return map;
  }

  function loadWordsFromLocalStorage() {
    var words = localStorage['twittermute.blacklist'] || [];
    if(!(words instanceof Array)) {
      words = words.split(',');
    }

    return words;
  }

  // Initialize list of banned words
  function getMatchingTweets() {
    var tweets = document.querySelectorAll('.tweet-text');
    [].forEach.call(tweets, (tweet) => {
      // Lowercase everything.
      var textContent = tweet.textContent.toLowerCase();

      // Hardcoded problems to test against my own timeline, will be updated in the
      // future.
      blacklistedWords.forEach((word) => {
        if (textContent.indexOf(word.toLowerCase()) !== -1) {
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
