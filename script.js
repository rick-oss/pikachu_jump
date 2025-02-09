const pikachu = document.querySelector(".pikachu");
const pokeball = document.querySelector(".pokeball");
const rocketBallon = document.querySelector(".rocket-ballon");
const gameBoard = document.querySelector(".game-board");

let score = 0;
let highScore = 0;
let changeSchedule = 0;
let gameLoopInterval;

let isGamingRunning = false;
let gameOver = false;
let isDay = true;

let scoreTimer = 0;
const scoreUpdateInterval = 20;

let currentRotation = 360;
const degreesPerFrame = 3.6;

function jump() {
  pikachu.classList.add("jump");

  setTimeout(() => {
    pikachu.classList.remove("jump");
  }, 500);
}

function formatScore(score) {
  return score.toString().padStart(4, "0");
}

function updateScore() {
  score++;
  document.querySelector(".score").textContent = `S:${formatScore(score)}`;
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    document.querySelector(".highScore").textContent = `HS:${formatScore(highScore)}`;
  }
}

function updateSchedule() {
  changeSchedule++;

  if (changeSchedule >= 1000) {
    isDay = !isDay;

    if (!isDay) {
      gameBoard.classList.add("night");
    } else {
      gameBoard.classList.remove("night");
    }

    changeSchedule = 0;
  }
}

function updateRotation() {
  if (gameOver) return;

  currentRotation = (currentRotation - degreesPerFrame) % 360;
  pokeball.style.transform = `rotate(${currentRotation}deg)`;
}

function checkCollisions() {
  let screenWidth = window.innerWidth;
  let pokeballPosition = pokeball.offsetLeft;

  // Obtém o estilo computado dos elementos(O replace retira o px do valores e + no inicio é uma forma rápida de converter a string resultante em um número)
  let pikachuPosition = +window.getComputedStyle(pikachu).bottom.replace("px", "");
  let rocketBallonPosition = +window.getComputedStyle(rocketBallon).right.replace("px", "");

  if (screenWidth < 768) {
    collisionPikachu = 50;
    collisionPokeball = 70;
  } else {
    collisionPikachu = 80;
    collisionPokeball = 120;
  }

  // Verifica a posições do pokeball e do pikachu para decretar o game over
  if (pokeballPosition <= collisionPokeball && pokeballPosition > 0 && pikachuPosition <= collisionPikachu) {
    // Game Over
    gameOver = true;
    isGamingRunning = false;

    // Atualiza a pontuação máxima alcançada
    updateHighScore();

    // Remove a animaçao do pokeball
    pokeball.style.animation = "none";
    pokeball.style.left = `${pokeballPosition}px`;

    // Remove a animaçao do balão
    rocketBallon.src = "./imagens/rocket-ballon.png";
    rocketBallon.style.animation = "none";
    rocketBallon.style.right = `${rocketBallonPosition}px`;

    // Remove a animaçao do pikachu
    pikachu.style.animation = "none";
    pikachu.style.bottom = `${pikachuPosition}px`;

    // Muda a imagem do pikachu para o game over
    pikachu.src = "./imagens/game-over.png";
    if (screenWidth < 768) {
      pikachu.style.width = "80px";
    } else {
      pikachu.style.width = "125px";
      pikachu.style.height = "100px";
    }
    clearInterval(gameLoopInterval);
  }
}

function gameLoop() {
  if (!gameOver) {
    pikachu.src = "./imagens/pikachu.gif";

    // Add as animações
    pokeball.classList.add("animate");
    rocketBallon.classList.add("animate");

    updateRotation();
    checkCollisions();

    scoreTimer += 20;
    if (scoreTimer >= scoreUpdateInterval) {
      updateScore();
      updateSchedule();
      scoreTimer = 0;
    }

    document.addEventListener("keydown", function (event) {
      switch (event.key) {
        case "j":
        case "ArrowUp":
          jump();
          break;
      }
    });
  }
}

function startGame() {
  // Inicia o jogo
  gameLoopInterval = setInterval(gameLoop, 20);

  // Reseta o estado do jogo pós game over
  score = 0;
  changeSchedule = 0;
  isDay = true;
  gameOver = false;
  isGamingRunning = true;

  // Atualiza as pontuações na tela
  document.querySelector(".score").textContent = `S:${formatScore(score)}`;
  document.querySelector(".highScore").textContent = `HS:${formatScore(highScore)}`;

  // Remove o estilo de game over do Pikachu
  pikachu.src = "./imagens/pikachu.gif"; // Caminho original da imagem
  pikachu.style.width = "";
  pikachu.style.height = "";
  pikachu.style.bottom = "";
  pikachu.style.animation = "";

  // Reseta animações e posições dos elementos
  pokeball.style.animation = "";
  pokeball.style.left = "";

  rocketBallon.src = "./imagens/rocket-ballon.gif"; // Caminho original da imagem
  rocketBallon.style.animation = "";
  rocketBallon.style.right = "";

  // Remove o modo noturno, se estiver ativo
  gameBoard.classList.remove("night");
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !isGamingRunning) {
    // Inicia o jogo
    startGame();
  }
});
