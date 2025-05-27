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
    const getFirstSentence = (text) => {
      const match = text.match(/.*?[.?!](\s|$)/);
      return match ? match[0].trim() : text.slice(0, 100) + '...';
    };
    
    const processPosts = (postTexts) => {
      const first3 = postTexts.slice(0, 3);
      Promise.all(
        first3.map(async (text) => {
          const fullText = text;
          const sentence = getFirstSentence(text);
          const sentiment = await analyzeSentiment(sentence);
          return { sentence, sentiment, fullText};
        })
      ).then(results => {
        //chrome.runtime.sendMessage({ scanResults: results });
        sendResponse({ posts: results });
      });
    };
    
    if (texts.length > 0) {
      processPosts(texts);
    } else {
      console.log("Trying again in 1 second...");
      setTimeout(() => {
        texts = extractPosts();
        if (texts.length > 0) {
          processPosts(texts);
        } else {
          sendResponse({ posts: [], sentiment: "none" });
        }
      }, 1000);
    }
    

    return true;
  }
});
