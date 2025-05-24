document.getElementById('scanBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "scan_posts" }, (response) => {
      const results = document.getElementById('results');
      results.innerHTML = '';

      if (response && response.posts && response.posts.length > 0) {
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;
      
        response.posts.forEach(({ sentence, sentiment }, i) => {
          // Sentiment count and summary
          const sent = sentiment.toUpperCase();
          if (sent.includes("POSITIVE")) positiveCount++;
          else if (sent.includes("NEGATIVE")) negativeCount++;
          else neutralCount++;
      
          const li = document.createElement('li');
          li.textContent = `Post ${i + 1}: ${sentence} — Sentiment: ${sentiment}`;
          results.appendChild(li);
        });
        const summary = document.createElement('li');
        summary.style.fontWeight = 'bold';
        summary.style.marginTop = '8px';
        summary.textContent = `${positiveCount} positive, ${negativeCount} negative, ${neutralCount} neutral`;
        results.appendChild(summary);
      } else {
        results.innerHTML = '<li>No posts found or error occurred.</li>';
      }
      
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.sentiment && message.original) {
    const sentimentDiv = document.getElementById('sentiment');
    sentimentDiv.textContent = `First Post Sentiment: ${message.sentiment}`;
  }
});