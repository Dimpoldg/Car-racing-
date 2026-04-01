const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let gameRunning = false;
let gameOver = false;

let player = { x: 175, y: 500, w: 60, h: 80 };
let enemies = [];
let score = 0;

let playerImg = new Image();

/* 📸 Gallery Image */
const upload = document.getElementById("upload");

if (upload) {
  upload.addEventListener("change", function (e) {
    let file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = function (event) {
      playerImg.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}

/* 🎮 START GAME */
if (startBtn) {
  startBtn.addEventListener("click", () => {
    gameRunning = true;
    startBtn.style.display = "none";
    restartBtn.style.display = "block";
  });
}

/* 🔁 RESTART GAME */
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
}

/* ⌨️ LEFT RIGHT CONTROL (KEYBOARD) */
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft" || e.key === "a") {
    player.x -= 30;
  }

  if (e.key === "ArrowRight" || e.key === "d") {
    player.x += 30;
  }

  if (player.x < 0) player.x = 0;
  if (player.x > 340) player.x = 340;
});

/* 📱 TOUCH CONTROL (MOBILE) */
canvas.addEventListener("touchmove", (e) => {
  if (!gameRunning) return;

  let rect = canvas.getBoundingClientRect();
  let touchX = e.touches[0].clientX - rect.left;

  player.x = touchX - player.w / 2;

  if (player.x < 0) player.x = 0;
  if (player.x > 340) player.x = 340;
});

/* 🚗 ENEMY CREATE */
function createEnemy() {
  enemies.push({
    x: Math.floor(Math.random() * 350),
    y: -100,
    w: 50,
    h: 80
  });
}

/* 🛣️ ROAD */
function drawRoad() {
  ctx.fillStyle = "#333";
  ctx.fillRect(150, 0, 100, 600);
}

/* 🚗 PLAYER DRAW */
function drawPlayer() {
  if (playerImg.src) {
    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
  } else {
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.w, player.h);
  }
}

/* 💥 ENEMIES */
function drawEnemies() {
  ctx.fillStyle = "red";

  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    e.y += 5;

    ctx.fillRect(e.x, e.y, e.w, e.h);

    // collision
    if (
      player.x < e.x + e.w &&
      player.x + player.w > e.x &&
      player.y < e.y + e.h &&
      player.y + player.h > e.y
    ) {
      gameOver = true;
    }
  }
}

/* 🏆 SCORE */
function updateScore() {
  if (gameRunning && !gameOver) {
    score++;
    const scoreEl = document.getElementById("score");
    if (scoreEl) scoreEl.innerText = "Score: " + score;
  }
}

/* 🔁 GAME LOOP */
function loop() {
  if (!gameRunning) {
    requestAnimationFrame(loop);
    return;
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 110, 300);
    return;
  }

  ctx.clearRect(0, 0, 400, 600);

  drawRoad();
  drawPlayer();
  drawEnemies();

  requestAnimationFrame(loop);
}

/* 🚀 START GAME ENGINE */
setInterval(createEnemy, 1200);
setInterval(updateScore, 500);
loop();
