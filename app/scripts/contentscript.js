'use strict';

// Watch Tweet Bar event for checking when the View More Tweets button is
// clicked.

//var moreTweetsBar = document.querySelectorAll('.new-tweets-bar')[0];

// Globals for banned words? Load from a JavaScript object/setting/localStorage
// in the future.

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TwitterPage = (function () {
  function TwitterPage() {
    var _this = this;

    _classCallCheck(this, TwitterPage);

    // Initialize list of banned words
    this.numberHiddenTweets = 0;
    this.matchingTweets = [];
    // TO-DO: Move this to its own module for the Blacklist, rather than keeping
    // it in popup, mmkay? Create Blacklist Module.
    this.blacklistedWords = ['LinkedIn'];

    // Tab send info on load.
    chrome.runtime.sendMessage({ command: 'update' }, function (response) {
      console.log('Asking for an update');
      console.log(response);
      if (response && response.blackListedWords) {
        _this.blacklistedWords = response.blackListedWords;
      }
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      console.log('Message received!');
      if (request.blacklistedWords) {
        console.log('Updated response!');
        _this.blacklistedWords = request.blacklistedWords;
        _this.getMatchingTweets();
        sendResponse({ status: 'Updated!', words: _this.blacklistedWords });
      }
    });

    this.getMatchingTweets();
  }

  _createClass(TwitterPage, [{
    key: 'getMatchingTweets',
    value: function getMatchingTweets() {
      var _this2 = this;

      var tweets = document.querySelectorAll('.tweet-text');
      [].forEach.call(tweets, function (tweet) {
        var textContent = tweet.textContent.toLowerCase(); // Lowercase everything.
        // Hardcoded problems to test against my own timeline, will be updated in the
        // future.
        _this2.blacklistedWords.forEach(function (word) {
          if (textContent.indexOf(word.toLowerCase()) > 0) {
            _this2.hideTweet(tweet);
          }
        });
      });
    }
  }, {
    key: 'fetchTweetContainer',
    value: function fetchTweetContainer(tweet) {
      return tweet.parentNode.parentNode.parentNode; // it takes three traversals to get the entire tweet container
    }
  }, {
    key: 'hideTweet',
    value: function hideTweet(tweet) {
      // Text Content Tweet.
      var tweetContainer = this.fetchTweetContainer(tweet);
      var tweetClass = tweetContainer.className.trim('\n');

      var hiddenTweetClass = tweetClass + ' hide-element';

      tweetContainer.className = hiddenTweetClass;
    }
  }, {
    key: 'loadMoreTweets',
    value: function loadMoreTweets() {}
  }]);

  return TwitterPage;
})();

var page = new TwitterPage();
console.log(page);
//# sourceMappingURL=contentscript.js.map
