'use strict';

// Watch Tweet Bar event for checking when the View More Tweets button is
// clicked.

//var moreTweetsBar = document.querySelectorAll('.new-tweets-bar')[0];

var tweets = document.querySelectorAll('.tweet-text');

console.log(tweets);
[].forEach.call(tweets, function (tweet) {
  var textContent = tweet.textContent.toLowerCase(); // Lowercase everything.
  if (textContent.indexOf('problems') > 0) {
    console.log('Keyword found!');
    console.log(tweet.textContent);
    var contentElement = tweet.parentNode;
    var tweetElement = contentElement.parentNode.parentNode;
    console.log(tweetElement);
    console.log(tweetElement.className);
    var tweetClassString = tweetElement.className.trim('\n');
    tweetClassString += ' hide-element'; // We want to hide this element.
    console.log(tweetClassString);
    tweetElement.className = tweetClassString;
  }
});
//  console.log(tweet.textContent);

console.log(tweets);
//# sourceMappingURL=contentscript.js.map
