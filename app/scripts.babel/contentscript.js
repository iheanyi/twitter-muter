'use strict';

// Watch Tweet Bar event for checking when the View More Tweets button is
// clicked.


//var moreTweetsBar = document.querySelectorAll('.new-tweets-bar')[0];

// Globals for banned words? Load from a JavaScript object/setting/localStorage
// in the future.

class TwitterPage {
  constructor() {
    // Initialize list of banned words
    this.numberHiddenTweets = 0;
    this.matchingTweets = [];
    // TO-DO: Move this to its own module for the Blacklist, rather than keeping
    // it in popup, mmkay? Create Blacklist Module.
    this.blacklistedWords = ['LinkedIn'];


    // Tab send info on load.
    chrome.runtime.sendMessage({command: 'update'}, (response) => {
      console.log('Asking for an update');
      console.log(response);
      if(response && response.blackListedWords) {  
        this.blacklistedWords = response.blackListedWords;
      }
    }); 

    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
          console.log('Message received!');
          if (request.blacklistedWords) {
            console.log('Updated response!');
            this.blacklistedWords = request.blacklistedWords;
            this.getMatchingTweets();
            sendResponse({status: 'Updated!', words: this.blacklistedWords});
          }
        });

    this.getMatchingTweets();
  }

  getMatchingTweets() {
    var tweets = document.querySelectorAll('.tweet-text');
    [].forEach.call(tweets, (tweet) => {
      var textContent = tweet.textContent.toLowerCase(); // Lowercase everything.
      // Hardcoded problems to test against my own timeline, will be updated in the
      // future.
      this.blacklistedWords.forEach((word) => {
        if (textContent.indexOf(word.toLowerCase()) > 0) {
          this.hideTweet(tweet);
        }
      });
    });
  }


  fetchTweetContainer(tweet) {
    return tweet.parentNode.parentNode.parentNode; // it takes three traversals to get the entire tweet container
  }

  hideTweet(tweet) {
    // Text Content Tweet.
    var tweetContainer = this.fetchTweetContainer(tweet);
    var tweetClass = tweetContainer.className.trim('\n');

    var hiddenTweetClass = tweetClass + ' hide-element';

    tweetContainer.className = hiddenTweetClass; 
  }

  loadMoreTweets() {

  }



}

let page = new TwitterPage();
console.log(page);
