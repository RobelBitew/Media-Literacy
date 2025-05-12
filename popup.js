document.getElementById('scanBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "scan_posts" }, (response) => {
      const results = document.getElementById('results');
      results.innerHTML = '';

      if (response && response.posts && response.posts.length > 0) {
        response.posts.forEach(text => {
          const li = document.createElement('li');
          li.textContent = text.slice(0, 200) + '...';
          results.appendChild(li);
        });
      } else {
        results.innerHTML = '<li>No posts found or error occurred.</li>';
      }
    });
  });
});
