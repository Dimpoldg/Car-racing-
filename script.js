const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = { x: 175, y: 500, w: 60, h: 80 };
let enemies = [];
let score = 0;
let gameOver = false;

let playerImg = new Image();


// 📸 GALLERY IMAGE SELECT
document.getElementById("upload").addEventListener("change", function (e) {
  let file = e.target.files[0];
  let reader = new FileReader();

  reader.onload = function (event) {
    playerImg.src = event.target.result;
  };

  reader.readAsDataURL(file);
});


// 🎮 CONTROL
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 25;
  if (e.key === "ArrowRight" && player.x < 340) player.x += 25;
});


// 🚗 ENEMY CREATE
function createEnemy() {
  enemies.push({
    x: Math.floor(Math.random() * 350),
    y: -100,
    w: 50,
    h: 80
  });
}


// 🛣️ ROAD
function drawRoad() {
  ctx.fillStyle = "#333";
  ctx.fillRect(150, 0, 100, 600);
}


// 🚗 PLAYER DRAW (PHOTO)
function drawPlayer() {
  if (playerImg.src) {
    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
  } else {
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.w, player.h);
  }
}


// 💥 ENEMIES
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


// 🏆 SCORE
function updateScore() {
  if (!gameOver) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
  }
}


// 🔁 GAME LOOP
function loop() {
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


// START GAME
setInterval(createEnemy, 1200);
setInterval(updateScore, 500);
loop();
