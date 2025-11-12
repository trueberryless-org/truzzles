document.addEventListener("DOMContentLoaded", () => {
  const boxes = Array.from(document.querySelectorAll(".box"));
  const newGameBtn = document.getElementById("new-game-btn");
  const resetBtn = document.getElementById("reset-btn");
  const message = document.getElementById("message");
  const currentClicksDisplay = document.getElementById("current-clicks");
  let initialValues = [];
  let minClickCount = 0;
  let currentClicks = 0;

  function initializeGame() {
    boxes.forEach((box) => {
      const randomValue = Math.floor(Math.random() * 4);
      box.querySelector(".value").textContent = randomValue;
      box.querySelector(".counter").textContent = "Clicks: 0";
      box.classList.remove("solved");

      if (randomValue === 3) {
        box.querySelector(".value").setAttribute("data-change", "=0");
      } else {
        box.querySelector(".value").setAttribute("data-change", "+1");
      }
    });
    saveInitialValues();
    minClickCount = calculateMinClicks();
    message.textContent = `Minimum clicks to solve: ${minClickCount}`;
    currentClicks = 0;
    currentClicksDisplay.textContent = `Total clicks: ${currentClicks}`;
    newGameBtn.style.display = "none";
  }

  function resetGame() {
    boxes.forEach((box, index) => {
      box.querySelector(".value").textContent = initialValues[index];
      box.querySelector(".counter").textContent = "Clicks: 0";
      box.classList.remove("solved");
    });
    message.textContent = `Minimum clicks to solve: ${minClickCount}`;
    currentClicks = 0;
    currentClicksDisplay.textContent = `Total clicks: ${currentClicks}`;
    currentClicksDisplay.style.color = "inherit";
    newGameBtn.style.display = "none";
  }

  function saveInitialValues() {
    initialValues = boxes.map((box) => box.querySelector(".value").textContent);
  }

  boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      incrementBox(index);
      incrementCounter(index);
      currentClicks += 1;
      currentClicksDisplay.textContent = `Total clicks: ${currentClicks}`;
      if (currentClicks > minClickCount) {
        currentClicksDisplay.style.color = "#dc3545";
      }
      checkSolved();
    });
  });

  newGameBtn.addEventListener("click", initializeGame);
  resetBtn.addEventListener("click", resetGame);

  function incrementBox(index) {
    const adjacentIndices = getAdjacentIndices(index);

    [index, ...adjacentIndices].forEach((i) => {
      const box = boxes[i].querySelector(".value");
      let value = parseInt(box.textContent, 10);
      value = (value + 1) % 4;
      if (value === 3) {
        box.setAttribute("data-change", "=0");
      } else {
        box.setAttribute("data-change", "+1");
      }
      box.textContent = value;
    });
  }

  function incrementCounter(index) {
    const counter = boxes[index].querySelector(".counter");
    let count = parseInt(counter.textContent.split(": ")[1], 10);
    count += 1;
    counter.textContent = `Clicks: ${count}`;
  }

  function getAdjacentIndices(index) {
    const adjacent = [];

    if (index % 2 !== 0) adjacent.push(index - 1); // Left
    if (index % 2 === 0 && index + 1 < 4) adjacent.push(index + 1); // Right
    if (index - 2 >= 0) adjacent.push(index - 2); // Above
    if (index + 2 < 4) adjacent.push(index + 2); // Below

    return adjacent;
  }

  function checkSolved() {
    const allZero = boxes.every(
      (box) => box.querySelector(".value").textContent === "0"
    );
    const totalClicks = boxes.reduce((sum, box) => {
      return (
        sum +
        parseInt(box.querySelector(".counter").textContent.split(": ")[1], 10)
      );
    }, 0);

    if (allZero) {
      boxes.forEach((box) => box.classList.add("solved"));
      if (totalClicks === minClickCount) {
        message.textContent = `Congratulations! You have solved the puzzle with the minimum number of ${minClickCount} clicks!`;
        newGameBtn.style.display = "block";
      } else {
        message.textContent = `Puzzle solved! Try again to solve it with just ${minClickCount} clicks.`;
      }
    } else {
      boxes.forEach((box) => box.classList.remove("solved"));
      message.textContent = `Minimum clicks to solve: ${minClickCount}`;
    }
  }

  function calculateMinClicks() {
    const initialState = boxes.map((box) =>
      parseInt(box.querySelector(".value").textContent, 10)
    );
    const targetState = [0, 0, 0, 0];
    const queue = [{ state: initialState, clicks: 0 }];
    const visited = new Set();

    visited.add(stateToString(initialState));

    while (queue.length > 0) {
      const { state, clicks } = queue.shift();

      if (state.toString() === targetState.toString()) {
        return clicks;
      }

      for (let i = 0; i < 4; i++) {
        const newState = state.slice();
        const indices = [i, ...getAdjacentIndices(i)];

        indices.forEach((index) => {
          newState[index] = (newState[index] + 1) % 4;
        });

        const stateStr = stateToString(newState);

        if (!visited.has(stateStr)) {
          visited.add(stateStr);
          queue.push({ state: newState, clicks: clicks + 1 });
        }
      }
    }

    return -1; // Should not reach here
  }

  function stateToString(state) {
    return state.join(",");
  }

  initializeGame();
});
