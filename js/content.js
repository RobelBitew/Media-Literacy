console.log("Post Analyzer Content Script loaded...");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scan_posts") {
    console.log("Received 'scan_posts' message, trying to scan posts...");

    // extract articles(posts)
    const extractPosts = () => {
      const articles = document.querySelectorAll('article');
      if (articles.length === 0) {
        console.warn("No articles found, page might still be loading or selector needs adjustment.");
      }
      const texts = Array.from(articles).map(article => article.innerText);
      console.log(`Extracted ${texts.length} posts.`);
      return texts;
    };

    //wait and scan
    let texts = extractPosts();
    if (texts.length > 0) {
      sendResponse({ posts: texts });
    } else {
      console.log("Trying again in 1 second...");
      setTimeout(() => {
        texts = extractPosts();
        sendResponse({ posts: texts });
      }, 1000);
    }

    return true;
  }
});
