//poll
const controlScore = 0.79;
const authoritarianScore = 0.17;

let poll = {
  question: "Corpus",
  answers: ["Control Similarity", "Authoritarian Similarity"],
  percentage: [controlScore, authoritarianScore],
};

let pollDOM = {
  question:document.querySelector(".poll .question"),
  answers:document.querySelector(".poll .answers"),
};
showResults();

pollDOM.question.innerText = poll.question;
pollDOM.answers.innerHTML = poll.answers
  .map(function (answer, i) {
    return `
    <div class="answer" data-index="${i}">
    <span class ="text">${answer}</span>
    <span class="percentage-bar"></span>
    <span class="percentage-value"></span>
    </div>
    `;
  })
  .join("");

function showResults() {
  const answers = document.querySelectorAll(".poll .answers .answer");
  for (let i = 0; i < answers.length; i++) {
    const score = poll.percentage[i];
    const percent = Math.round(score *100);

    const bar = answers[i].querySelector(".percentage-bar");
    const value = answers[i].querySelector(".percentage-value");

    if (bar && value) {
      bar.style.width = percent + "%";
      value.innerText = percent + "%";
    } 
  }
}
showResults();