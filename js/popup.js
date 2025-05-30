document.getElementById('scanBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "scan_posts" }, (response) => {
      const results = document.getElementById('results');
      results.innerHTML = '';

      if (response && response.posts && response.posts.length > 0) {
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;
      
        response.posts.forEach((post, i) => {
          const sent = post.sentiment.toUpperCase();
          if (sent.includes("POSITIVE")) positiveCount++;
          else if (sent.includes("NEGATIVE")) negativeCount++;
          else neutralCount++;
        
          const li = createInsightListItem(post, i);
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

function createInsightListItem(post, index) {
  const { sentence, sentiment, fullText } = post;

  const li = document.createElement('li');
  li.innerHTML = `
  <div style="font-weight: bold;">Post ${index + 1}</div>
  <div style="margin-bottom: 4px;">${sentence}</div>
  <div class="sentiment-tag sentiment-${sentiment.toLowerCase()}">
    Sentiment: ${sentiment}
  </div>
  <div style="font-size: 0.85em; color: #888;">Click for insight</div>
`;
  li.style.cursor = "pointer";
  li.style.position = "relative";

  let insightShown = false;
  let insightDiv = null;

  li.addEventListener('click', () => {
    console.log("Sending fullText to insight:", fullText, typeof fullText);

    if (insightShown && insightDiv) {
      insightDiv.remove();
      insightShown = false;
      return;
    }

    insightDiv = document.createElement('div');
    insightDiv.style.marginTop = '4px';
    insightDiv.style.fontStyle = 'italic';
    insightDiv.textContent = "Generating insight...";
    li.appendChild(insightDiv);
    insightShown = true;

    if (!fullText || typeof fullText !== "string" || fullText.trim() === "") {
      insightDiv.textContent = "No valid text to analyze.";
      return;
    }

    fetch("http://localhost:8000/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: fullText.trim() })
    })
      .then(res => res.json())
      .then(data => {
        const formatted = data.insight
        .split(/[\n\r]+/)
        .map(line => `<div style="margin-bottom: 2px;">${line}</div>`)
        .join("");
      
      insightDiv.innerHTML = `<strong>Insight:</strong><br>${formatted}`;
      
      })
      .catch(err => {
        console.error("Insight fetch failed:", err);
        insightDiv.textContent = "Failed to load insight.";
      });
  });

  return li;
}

//poll

let poll = {
  question: "Do you agree with the analysis?",
  answers: ["yes", "no"],
  pollCount: 20,
  answersWeight: [10, 10],
  selectedAnswer: -1,
};

let pollDOM = {
  question: document.querySelector(".poll .question"),
  answers: document.querySelector(".poll .answers"),
};

pollDOM.question.innerText = poll.question;
pollDOM.answers.innerHTML = poll.answers
  .map(function (answer, i) {
    return `
    <div class="answer" onclick="markAnswer('${i}')">
    ${answer}
    <span class="percentage-bar"></span>
    <span class="percentage-value"></span>
    </div>
    `;
  })
  .join("");

function markAnswer(i) {
  poll.selectedAnswer = +i;
  try {
    document
      .querySelector(".poll .answers .answer.selected")
      .classList.remove("selected");
  } catch (msg) {}
  document
    .querySelectorAll(".poll .answers .answer")
    [+i].classList.add("selected");
  showResults();
}

function showResults() {
  let answers = document.querySelectorAll(".poll .answers .answer");
  for (let i = 0; i < answers.length; i++) {
    let percentage = 0;
    if (i == poll.selectedAnswer) {
      percentage = Math.round(
        ((poll.answersWeight[i] + 1) * 100) / (poll.pollCount + 1)
      );
    } else {
      percentage = Math.round(
        (poll.answersWeight[i] * 100) / (poll.pollCount + 1)
      );
    }

    answers[i].querySelector(".percentage-bar").style.width = percentage + "%";
    answers[i].querySelector(".percentage-value").innerText = percentage + "%";
  }
}

