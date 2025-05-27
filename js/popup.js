document.getElementById("scanBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "scan_posts" },
      (response) => {
        const results = document.getElementById("results");
        results.innerHTML = "";

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

            const li = document.createElement("li");
            li.innerHTML = `Post ${
              i + 1
            }: ${sentence} — <span class="sentiment ${sentiment.toLowerCase()}">Sentiment: ${sentiment}</span>`;
            results.appendChild(li);
          });
          const summary = document.createElement("li");
          summary.style.fontWeight = "bold";
          summary.style.marginTop = "8px";
          summary.textContent = `${positiveCount} positive, ${negativeCount} negative, ${neutralCount} neutral`;
          results.appendChild(summary);
        } else {
          results.innerHTML = "<li>No posts found or error occurred.</li>";
        }
      }
    );
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.sentiment && message.original) {
    const sentimentDiv = document.getElementById("sentiment");
    sentimentDiv.textContent = `First Post Sentiment: ${message.sentiment}`;
  }
});

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
