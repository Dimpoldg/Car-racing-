let scene, camera, renderer;
let car;
let keys = {};
let enemies = [];
let gameRunning = false;
let score = 0;

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreEl = document.getElementById("score");

/* 🔊 SOUND */
let engine = new Audio("sounds/engine.mp3");
engine.loop = true;
engine.volume = 0.5;

/* 🌍 INIT */
function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("game"),
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  camera.position.set(0, 4, 8);

  /* 💡 LIGHT (IMPORTANT) */
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  /* 🛣️ ROAD */
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 500),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  road.rotation.x = -Math.PI / 2;
  scene.add(road);

  /* 🌆 BUILDINGS */
  for (let i = 0; i < 50; i++) {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(2, Math.random() * 15 + 2, 2),
      new THREE.MeshStandardMaterial({ color: 0x444444 })
    );
    b.position.set((Math.random() - 0.5) * 40, 0, -i * 8);
    scene.add(b);
  }

  /* 🚗 LOAD CAR (GLB + fallback) */
  const loader = new THREE.GLTFLoader();

  loader.load(
    "models/car.glb",

    (gltf) => {
      car = gltf.scene;
      car.scale.set(0.8, 0.8, 0.8);
      car.position.set(0, 0.5, 0);
      scene.add(car);
    },

    undefined,

    (error) => {
      console.log("GLB failed, using box car");

      // 🔥 fallback car
      car = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 2),
        new THREE.MeshStandardMaterial({ color: 0x00ff00 })
      );

      car.position.y = 0.5;
      scene.add(car);
    }
  );

  animate();
}

/* 🎮 CONTROLS */
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

/* 🚗 ENEMY */
function spawnEnemy() {
  const e = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 2),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );

  e.position.set((Math.random() - 0.5) * 4, 0.5, -80);
  scene.add(e);
  enemies.push(e);
}

/* 🔁 GAME LOOP */
function animate() {
  requestAnimationFrame(animate);

  if (!gameRunning || !car) {
    renderer.render(scene, camera);
    return;
  }

  /* 🚗 MOVE */
  if (keys["ArrowLeft"] || keys["a"]) car.position.x -= 0.1;
  if (keys["ArrowRight"] || keys["d"]) car.position.x += 0.1;
  if (keys["ArrowUp"] || keys["w"]) car.position.z -= 0.2;

  /* LIMIT */
  car.position.x = Math.max(-3, Math.min(3, car.position.x));

  /* 🎥 CAMERA FOLLOW */
  camera.position.x += (car.position.x - camera.position.x) * 0.1;
  camera.position.z = car.position.z + 6;
  camera.lookAt(car.position);

  /* 🚗 ENEMIES */
  enemies.forEach((e) => {
    e.position.z += 0.4;

    if (e.position.distanceTo(car.position) < 1.5) {
      gameRunning = false;
      alert("🚔 Game Over!");
    }

    if (e.position.z > car.position.z + 10) {
      e.position.z = car.position.z - 100;
      score++;
      scoreEl.innerText = "Score: " + score;
    }
  });

  renderer.render(scene, camera);
}

/* ▶ START */
startBtn.onclick = () => {
  gameRunning = true;
  engine.play().catch(() => {});
  startBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
};

/* 🔁 RESTART */
restartBtn.onclick = () => location.reload();

/* 📱 TOUCH CONTROL */
let lastX = null;

window.addEventListener("touchmove", (e) => {
  if (!car) return;

  let x = e.touches[0].clientX;

  if (lastX !== null) {
    let diff = x - lastX;
    car.position.x += diff * 0.01;
  }

  lastX = x;
});

window.addEventListener("touchend", () => {
  lastX = null;
});

/* 🚀 START GAME */
init();
setTimeout(() => {
  setInterval(spawnEnemy, 1200);
}, 1500);
