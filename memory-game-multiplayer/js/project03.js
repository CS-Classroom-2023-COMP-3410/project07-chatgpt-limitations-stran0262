const gameGrid = document.getElementById("gameGrid");
const restartBtn = document.getElementById("restartBtn");
const startGameBtn = document.getElementById("startGameBtn");
const gridRowsInput = document.getElementById("gridRows");
const gridColsInput = document.getElementById("gridCols");
const welcomeContainer = document.querySelector(".welcome-container");
const gameContainer = document.querySelector(".game-container");

const player1ScoreEl = document.getElementById("player1Score");
const player2ScoreEl = document.getElementById("player2Score");
const turnIndicator = document.getElementById("turnIndicator");

let cards = [];
let flippedCards = [];
let gridRows = 4;
let gridCols = 4;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;

const animalImages = [
  "cat.png", "dog.png", "elephant.png", "fox.png", "lion.png",
  "monkey.png", "panda.png", "rabbit.png", "tiger.png", "zebra.png"
];

startGameBtn.addEventListener("click", () => {
  gridRows = parseInt(gridRowsInput.value);
  gridCols = parseInt(gridColsInput.value);
  const totalCards = gridRows * gridCols;

  if (
    gridRows >= 2 && gridRows <= 10 &&
    gridCols >= 2 && gridCols <= 10 &&
    totalCards % 2 === 0
  ) {
    welcomeContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    initializeGame();
  } else {
    alert("Invalid grid size! Ensure the total number of cards is even and values are between 2 and 10.");
  }
});

function initializeGame() {
  const totalCards = gridRows * gridCols;
  const uniquePairs = totalCards / 2;

  const selectedImages = [];
  for (let i = 0; i < uniquePairs; i++) {
    selectedImages.push(animalImages[i % animalImages.length]);
  }

  const cardPairs = [...selectedImages, ...selectedImages];
  cards = shuffleArray(cardPairs);
  createGrid();

  // Set the initial turn message
  turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
}

function createGrid() {
  gameGrid.innerHTML = "";
  gameGrid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

  cards.forEach((image) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.symbol = image;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back"><img src="images/${image}" alt="Animal"></div>
      </div>
    `;
    card.addEventListener("click", handleCardClick);
    gameGrid.appendChild(card);
  });
}

function handleCardClick(e) {
  const clickedCard = e.currentTarget;

  if (
    clickedCard.classList.contains("flipped") ||
    clickedCard.classList.contains("matched") ||
    flippedCards.length === 2
  ) {
    return;
  }

  flippedCards.push(clickedCard);
  clickedCard.classList.add("flipped");

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    // Cards match
    card1.classList.add("matched", `player${currentPlayer}`);
    card2.classList.add("matched", `player${currentPlayer}`);
    flippedCards = [];

    // Update score
    if (currentPlayer === 1) {
      player1Score++;
      player1ScoreEl.textContent = player1Score;
    } else {
      player2Score++;
      player2ScoreEl.textContent = player2Score;
    }

    // Keep the same player if they matched cards
    turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;

    // Check if all cards are matched
    if (document.querySelectorAll(".card.matched").length === cards.length) {
      alert(`Game completed! Player 1: ${player1Score} - Player 2: ${player2Score}`);
    }
  } else {
    // Cards don't match
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];

      // Switch player after mismatch
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    }, 1000);
  }
}

restartBtn.addEventListener("click", () => {
  gameContainer.classList.add("hidden");
  welcomeContainer.classList.remove("hidden");
  player1Score = 0;
  player2Score = 0;
  player1ScoreEl.textContent = player1Score;
  player2ScoreEl.textContent = player2Score;
  turnIndicator.textContent = "Player 1's Turn";  // Reset the turn indicator on restart
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
