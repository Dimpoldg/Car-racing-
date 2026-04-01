let scene, camera, renderer;
let car;
let keys = {};
let enemies = [];
let gameRunning = false;
let score = 0;
let carLoaded = false;

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreEl = document.getElementById("score");

let engine = new Audio("sounds/engine.mp3");
engine.loop = true;

/* 🌍 INIT */
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("game") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.set(0, 4, 8);

  /* 🛣️ ROAD */
  let road = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 500),
    new THREE.MeshBasicMaterial({ color: 0x222222 })
  );
  road.rotation.x = -Math.PI/2;
  scene.add(road);

  /* 🌆 BUILDINGS */
  for (let i=0;i<50;i++) {
    let b = new THREE.Mesh(
      new THREE.BoxGeometry(2, Math.random()*15+2, 2),
      new THREE.MeshBasicMaterial({ color: 0x444444 })
    );
    b.position.set((Math.random()-0.5)*40,0,-i*8);
    scene.add(b);
  }

  /* 🚗 CAR */
  const loader = new THREE.GLTFLoader();

  loader.load("models/car.glb", (gltf) => {
    car = gltf.scene;
    car.scale.set(0.8,0.8,0.8);
    scene.add(car);
    carLoaded = true;
  });

  animate();
}

/* 🎮 CONTROLS */
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

/* 🚗 ENEMY */
function spawnEnemy() {
  let e = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,2),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );

  e.position.set((Math.random()-0.5)*4,0.5,-80);
  scene.add(e);
  enemies.push(e);
}

/* 🔁 LOOP */
function animate() {
  requestAnimationFrame(animate);

  if (!gameRunning || !carLoaded) {
    renderer.render(scene,camera);
    return;
  }

  /* MOVE */
  if (keys["ArrowLeft"]||keys["a"]) car.position.x -= 0.1;
  if (keys["ArrowRight"]||keys["d"]) car.position.x += 0.1;
  if (keys["ArrowUp"]||keys["w"]) car.position.z -= 0.2;

  /* CAMERA */
  camera.position.x += (car.position.x - camera.position.x)*0.1;
  camera.position.z = car.position.z + 6;
  camera.lookAt(car.position);

  /* ENEMY */
  enemies.forEach((e)=>{
    e.position.z += 0.4;

    if (e.position.z > car.position.z+10){
      e.position.z = car.position.z-100;
      score++;
      scoreEl.innerText = "Score: "+score;
    }

    if (Math.abs(e.position.x-car.position.x)<1 &&
        Math.abs(e.position.z-car.position.z)<2){
      gameRunning=false;
      alert("Game Over");
    }
  });

  renderer.render(scene,camera);
}

/* START */
startBtn.onclick = () => {
  gameRunning = true;
  engine.play();
  startBtn.style.display="none";
  restartBtn.style.display="inline-block";
};

/* RESTART */
restartBtn.onclick = () => location.reload();

/* TOUCH CONTROL */
let lastX = 0;
window.addEventListener("touchmove",(e)=>{
  if (!carLoaded) return;
  let x = e.touches[0].clientX;

  if (x < lastX) car.position.x -= 0.15;
  else car.position.x += 0.15;

  lastX = x;
});

/* START GAME */
init();
setInterval(spawnEnemy,1200);
