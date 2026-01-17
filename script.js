const startPage = document.querySelector(".quiz__start");
const [amountInput, difficultySelect, typeSelect, categorySelect] =
  document.querySelectorAll(".quiz__select");
const quizBtn = document.querySelector(".quiz__button");
const questionPage = document.querySelector(".question__page");
const questionList = document.querySelector(".question__list");
const questionTemplate = document.querySelector(".question__template");
const checkContainer = document.querySelector(".check__container");
const checkBtn = document.querySelector(".check__btn");
const resultsContainer = document.querySelector(".results__container");
const resultsScore = document.querySelector(".score");
const resultsTotal = document.querySelector(".total");
const resultsBtn = document.querySelector(".results__button");

let isEnd = false;

quizBtn.onclick = startQuiz;

resultsBtn.onclick = newGame;

function newGame() {
  isEnd = false;
  startPage.classList.remove("hide");
  questionPage.classList.add("hide");
  resultsContainer.classList.add("hide");
  checkContainer.classList.remove("hide");
  checkBtn.disabled = true;
}

function startQuiz() {
  const amount = amountInput.value;
  const difficulty = difficultySelect.value;
  const type = typeSelect.value;
  const category = categorySelect.value;
  if (amount <= 0) {
    alert("fill the amount !");
    return;
  }

  const params = new URLSearchParams();

  params.append("amount", amount);

  if (difficulty != "any") {
    params.append("difficulty", difficulty);
  }

  if (type != "any") {
    params.append("type", type);
  }

  if (category != "any") {
    params.append("category", category);
  }

  fetch(`https://opentdb.com/api.php?${params} `)
    .then((res) => res.json())
    .then((data) => {
      renderQuiz(
        data.results.map((item) => {
          item.answers = [...item.incorrect_answers, item.correct_answer].sort(
            () => Math.random() - 0.5,
          );

          return item;
        }),
      );

      startPage.classList.add("hide");
      questionPage.classList.remove("hide");
    });
}

function renderQuiz(questions) {
  console.log(questions);
  questionList.innerHTML = null;
  questions.forEach((item) => {
    const clone = questionTemplate.content.cloneNode(true);
    const cloneText = clone.querySelector(".question__text");
    cloneText.innerHTML = item.question;
    const cloneQuestions = clone.querySelector(".question__container");
    cloneQuestions.innerHTML = null;
    item.answers.forEach((answer) => {
      const btn = document.createElement("button");
      btn.classList.add("question__btn");
      btn.innerHTML = answer;
      btn.onclick = function () {
        if (!isEnd) {
          item.selected_answer = answer;
          renderQuiz(questions);
        }
      };
      if (item.correct_answer == answer && isEnd) {
        btn.style.backgroundColor = "green";
        btn.style.color = "white";
      } else if (
        item.correct_answer !== item.selected_answer &&
        answer == item.selected_answer &&
        isEnd
      ) {
        btn.style.backgroundColor = "red";
        btn.style.color = "white";
      } else if (item.selected_answer == answer) {
        btn.style.backgroundColor = "#2971b4";
        btn.style.color = "white";
      }
      cloneQuestions.append(btn);
    });
    questionList.append(clone);
  });
  const isEvery = questions.every((item) => item.selected_answer);
  if (isEvery) {
    checkBtn.disabled = false;
  }
  checkBtn.onclick = function () {
    isEnd = true;
    renderQuiz(questions);
    checkContainer.classList.add("hide");
    resultsContainer.classList.remove("hide");
    resultsTotal.innerHTML = questions.length;
    const correctAnswers = questions.filter(
      (item) => item.selected_answer == item.correct_answer,
    ).length;
    resultsScore.innerHTML = correctAnswers;
  };
}
