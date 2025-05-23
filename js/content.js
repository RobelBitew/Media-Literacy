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
    const analyzeSentiment = async (text) => {
      try {
        const res = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text })
        });
        const data = await res.json();
        return data.sentiment;
      } catch (err) {
        console.error("Error analyzing sentiment:", err);
        return "error";
      }
    };
    //wait and scan
    let texts = extractPosts();
    if (texts.length > 0) {
      // Analyze just first post for now
      analyzeSentiment(texts[0]).then(sentiment => {
        console.log(`Sentiment of first post: ${sentiment}`);
        chrome.runtime.sendMessage({ sentiment: sentiment, original: texts[0] });
        sendResponse({ posts: texts, sentiment: sentiment }); 
      });
    } else {
      console.log("Trying again in 1 second...");
      setTimeout(() => {
        texts = extractPosts();
        if (texts.length > 0) {
          analyzeSentiment(texts[0]).then(sentiment => {
            console.log(`Sentiment of first post (retry): ${sentiment}`);
            chrome.runtime.sendMessage({ sentiment: sentiment, original: texts[0] });
            sendResponse({ posts: texts, sentiment: sentiment });
          });
        } else {
          sendResponse({ posts: [], sentiment: "none" });
        }
      }, 1000);
    }

    return true;
  }
});
