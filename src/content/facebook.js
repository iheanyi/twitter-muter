import 'styles.css';

(function() {
  let blacklistedWords = [];

  function initialize() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.command === 'updateWords') {
        blacklistedWords = request.blacklistedWords;
        getMatchingTweets();
        sendResponse({status: "Updated!", blacklistedWords: blacklistedWords});
      }
    });
  }

  function getMatchingPosts() {
    var posts = document.querySelectorAll('.userContent');

    [].forEach.call(posts, (post) => {
      // Lowercase everything.
      var textContent = post.textContent.toLowerCase();

      blacklistedWords.forEach((word) => {
        if (textContent.indexOf(word.toLowerCase()) !== -1) {
          var postContainer = getPostContainer(post);
          hidePost(postContainer);
        }
      });
    });
  }

  function getPostContainer(post) {
    // Post's container is two elements high.
    return post.parentElement.parentElement;
  }

  function hidePost(post) {
    $(post).addClass('hide-element');
  }


})();
