'use strict';

// Watch Tweet Bar event for checking when the View More Tweets button is
// clicked.


//var moreTweetsBar = document.querySelectorAll('.new-tweets-bar')[0];

// Globals for banned words? Load from a JavaScript object/setting/localStorage
// in the future.

function hideTweet(tweet) {
  // Text Content Tweet.
    
}

function checkTweet(tweet) {

}

var tweets = document.querySelectorAll('.tweet-text');

var numberTweets = 0;

[].forEach.call(tweets, function(tweet) {
  var textContent = tweet.textContent.toLowerCase(); // Lowercase everything.
  // Hardcoded problems to test against my own timeline, will be updated in the
  // future.
  if(textContent.indexOf('problems') > 0) {
    var contentElement = tweet.parentNode;
    var tweetElement = contentElement.parentNode.parentNode;
    var tweetClassString = tweetElement.className.trim('\n');
    
    tweetClassString += ' hide-element'; // We want to hide this element.
    tweetElement.className = tweetClassString;
    numberTweets += 1;
  } 
});

