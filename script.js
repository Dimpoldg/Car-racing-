let scene, camera, renderer;
let car;
let keys = {};
let enemies = [];
let gameRunning = false;
let score = 0;

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreEl = document.getElementById("score");

/* 🌍 WORLD */
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("game") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* 🛣️ ROAD */
  let road = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 500),
    new THREE.MeshBasicMaterial({ color: 0x222222 })
  );
  road.rotation.x = -Math.PI/2;
  scene.add(road);

  /* 🌆 CITY BUILDINGS */
  for (let i = 0; i < 80; i++) {
    let b = new THREE.Mesh(
      new THREE.BoxGeometry(2, Math.random()*20 + 2, 2),
      new THREE.MeshBasicMaterial({ color: 0x444444 })
    );
    b.position.set((Math.random()-0.5)*50, 0, -i*6);
    scene.add(b);
  }

  /* 🚗 CAR (simple placeholder if GLB missing) */
  car = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,2),
    new THREE.MeshBasicMaterial({ color: 0x00ffcc })
  );
  car.position.y = 0.5;
  scene.add(car);

  /* 🎥 CAMERA FOLLOW (GTA STYLE) */
  camera.position.z = 6;
  camera.position.y = 4;

  animate();
}

/* 🎮 CONTROLS */
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

/* 🚗 TRAFFIC AI */
function spawnEnemy() {
  let e = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,2),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );

  e.position.set((Math.random()-0.5)*4, 0.5, -80);
  scene.add(e);
  enemies.push(e);
}

/* 🔁 GAME LOOP */
function animate() {
  requestAnimationFrame(animate);

  if (!gameRunning) {
    renderer.render(scene, camera);
    return;
  }

  /* 🚗 PLAYER MOVE (GTA STYLE) */
  if (keys["ArrowLeft"] || keys["a"]) car.position.x -= 0.1;
  if (keys["ArrowRight"] || keys["d"]) car.position.x += 0.1;
  if (keys["ArrowUp"] || keys["w"]) car.position.z -= 0.2;
  if (keys["ArrowDown"] || keys["s"]) car.position.z += 0.1;

  /* 🎥 CAMERA FOLLOW SMOOTH */
  camera.position.x += (car.position.x - camera.position.x) * 0.1;
  camera.position.z = car.position.z + 6;
  camera.lookAt(car.position);

  /* 🚗 ENEMY MOVEMENT */
  enemies.forEach((e) => {
    e.position.z += 0.4;

    if (e.position.z > car.position.z + 10) {
      e.position.z = car.position.z - 100;
      score++;
      scoreEl.innerText = "Score: " + score;
    }

    /* 💥 COLLISION */
    if (Math.abs(e.position.x - car.position.x) < 1 &&
        Math.abs(e.position.z - car.position.z) < 2) {
      gameRunning = false;
      alert("🚔 Busted! Game Over");
    }
  });

  renderer.render(scene, camera);
}

/* 🎮 START */
startBtn.onclick = () => {
  gameRunning = true;
  startBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
};

/* 🔁 RESTART */
restartBtn.onclick = () => location.reload();

/* 🚀 START GAME */
init();
setInterval(spawnEnemy, 1200);
