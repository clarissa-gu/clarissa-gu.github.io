let snake;
let rez = 20;
let food;
let w;
let h;
let score = 0;
let foodColor;
let baseFrameRate = 6;
let currentFrameRate;
let obstacles = [];
const WINNING_SCORE = 20; // win condition

let isGameOver = false;
let isGameWon = false;

let eatSound;
let gameOverSound;
let winSound;
let moveSound;

function preload() {
  eatSound = loadSound('sounds/music_food.mp3');
  gameOverSound = loadSound('sounds/music_gameover.mp3');
  moveSound = loadSound('sounds/music_move.mp3');
  winSound = loadSound('sounds/music_win.mp3');
}

function setup() {
  createCanvas(400, 400);
  w = floor(width / rez);
  h = floor(height / rez);
  resetGame();
}

function resetGame() {
  score = 0;
  currentFrameRate = baseFrameRate;
  frameRate(currentFrameRate);
  isGameOver = false;
  isGameWon = false;
  snake = new Snake();

  // start with 2 initial obstacles
  obstacles = [];
  addSingleObstacle();
  addSingleObstacle();

  foodLocation();
  loop();
}

function addSingleObstacle() {
  let obsX, obsY;
  let isValid = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  while (!isValid && attempts < MAX_ATTEMPTS) {
    obsX = floor(random(w));
    obsY = floor(random(h));
    isValid = true;
    attempts++;

    for (let part of snake.body) {
      if (obsX === part.x && obsY === part.y) {
        isValid = false;
        break;
      }
    }

    if (food && obsX === food.x && obsY === food.y) {
      isValid = false;
    }

    for (let obs of obstacles) {
      if (obs.x === obsX && obs.y === obsY) {
        isValid = false;
        break;
      }
    }
  }

  if (isValid) {
    obstacles.push(createVector(obsX, obsY));
  }
}

function foodLocation() {
  let isValid = false;
  let x, y;

  while (!isValid) {
    x = floor(random(w));
    y = floor(random(h));
    isValid = true;

    for (let part of snake.body) {
      if (part.x === x && part.y === y) {
        isValid = false;
        break;
      }
    }

    for (let obs of obstacles) {
      if (obs.x === x && obs.y === y) {
        isValid = false;
        break;
      }
    }
  }

  food = createVector(x, y);
  foodColor = color("red");
}

function keyPressed() {
  userStartAudio();

  // restart game when u click spacebar if the game is over or won
  if ((isGameOver || isGameWon) && key === ' ') {
    resetGame();
    return;
  }

  if (!isGameOver && !isGameWon) {
    if (keyCode === LEFT_ARROW && snake.xdir !== 1) {
      snake.setDir(-1, 0);
      moveSound.play();
    } else if (keyCode === RIGHT_ARROW && snake.xdir !== -1) {
      snake.setDir(1, 0);
      moveSound.play();
    } else if (keyCode === DOWN_ARROW && snake.ydir !== -1) {
      snake.setDir(0, 1);
      moveSound.play();
    } else if (keyCode === UP_ARROW && snake.ydir !== 1) {
      snake.setDir(0, -1);
      moveSound.play();
    }
  }
}

function draw() {
  scale(rez);
  background(220);

  // grid
  fill(0);
  stroke(200);
  strokeWeight(0.01);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      rect(x, y, 1, 1);
    }
  }

  // obstacles
  fill(255, 165, 0);
  for (let obs of obstacles) {
    rect(obs.x, obs.y, 1, 1);
  }

  // check if snake eats food
  if (snake.eat(food)) {
    score++;
    eatSound.play();

    if (score === WINNING_SCORE) {
      isGameWon = true;
      winSound.play();
    }

    if (score % 3 === 0) {
      addSingleObstacle();
    }
    currentFrameRate += 0.2;
    frameRate(currentFrameRate);
    foodLocation();
  }

  if (!isGameOver && !isGameWon) {
    snake.update();
  }

  snake.show();
  drawApple(food.x, food.y);

  // check game over
  if (snake.endGame(obstacles)) {
    if (!isGameOver) {
      gameOverSound.play();
    }
    isGameOver = true;
  }

  resetMatrix();

  // score display
  fill(255);
  noStroke();
  textSize(20);
  textAlign(LEFT);
  text("Score: " + score, 15, 30);

  if (isGameOver) {
    drawEndScreen("GAME OVER!", color(255, 0, 0), "Press SPACEBAR to Play Again");
  }

  if (isGameWon) {
    drawEndScreen("YOU WIN!", color(0, 200, 100), "Press SPACEBAR to Play Again");
  }
}

function drawApple(x, y) {
  push();
  translate(x + 0.5, y + 0.5);
  fill(foodColor);
  noStroke();
  ellipse(0, 0.05, 0.8, 0.8);
  stroke(100, 50, 0);
  strokeWeight(0.1);
  line(0, -0.2, 0.1, -0.4);
  fill(0, 200, 0);
  noStroke();
  ellipse(0.15, -0.35, 0.2, 0.1);
  pop();
}

function drawEndScreen(message, bgColor, instructionText) {
  background(bgColor);
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(40);
  text(message, width / 2, height / 2 - 50);

  textSize(24);
  text("Final Score: " + score, width / 2, height / 2);

  textSize(16);
  text(instructionText, width / 2, height / 2 + 55);

  noLoop();
}
