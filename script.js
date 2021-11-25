const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const topScoreList = document.querySelector("#top-score-list");
const progressBar = document.querySelector(".progress-bar");

const topScore = [];
let started = false;
let time = 0; // 1 = 10 millisecond, 100 = 1 second
let clock;
let progress = 0;

// Add leading zero to numbers 9 or below (purely for aesthetics):
function prependZero(n) {
  return n <= 9 ? `0${n}` : n;
}

// Run a standard minute/second/hundredths timer:
function timeToString(n) {
  const min = prependZero(Math.floor(n / 6000));
  const sec = prependZero(Math.floor((n % 6000) / 100));
  const mil = prependZero(Math.floor(n % 100));
  return `${min}:${sec}:${mil}`;
}

function timer() {
  time++;
  theTimer.textContent = timeToString(time);
}

// Match the text entered with the provided text on the page:
function checkText() {
  const inputText = testArea.value;
  const testText = originText.textContent;
  progress = Math.min(100, (inputText.length * 100) / testText.length);

  const subText = testText.substr(0, inputText.length);
  let result;
  if (inputText !== subText) {
    result = "wrong";
  }
  if (inputText === subText) {
    result = "right";
  }
  if (inputText === testText) {
    result = "completed";
  }

  return result;
}

// Start the timer:
function start() {
  started = true;
  clock = setInterval(timer, 10);
}

// Reset everything:
function reset() {
  clearInterval(clock);
  started = false;
  time = 0;
  progress = 0;
  testArea.value = null;
  testArea.blur();
  theTimer.textContent = "00:00:00";
  progressBar.style.width = `0%`;
}

// Update status
function update() {
  if (!started) {
    start();
  }
  const result = checkText();
  progressBar.style.width = `${progress}%`;

  if (result == "wrong") {
    progressBar.style.backgroundColor = "#e95d0f";
    testWrapper.style.borderColor = "#e95d0f";
  } else if (result == "right") {
    progressBar.style.backgroundColor = "#429890";
    testWrapper.style.borderColor = "#429890";
  } else if (result == "completed") {
    progressBar.style.backgroundColor = "#429890";
    testWrapper.style.borderColor = "#429890";

    const timeTaken = time;
    reset();
    alert(`Test Completed! Time taken: ${timeToString(timeTaken)}`);
    topScore.push(timeTaken);
    topScore.sort((a, b) => a - b);

    if (!topScore[0] || topScore[0] >= timeTaken) {
      alert("Congratulation! You beat the best record.");
    } else if (!topScore[1] || topScore[1] >= timeTaken) {
      alert("Congratulation! You beat the second best record.");
    } else if (!topScore[2] || topScore[2] >= timeTaken) {
      alert("Congratulation! You beat the third best record.");
    }

    topScoreList.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const s = topScore[i];
      if (!isNaN(s)) {
        topScoreList.innerHTML += `<li>${timeToString(s)}</li>`;
      }
    }
  }
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keyup", update);
resetButton.addEventListener("click", reset);
