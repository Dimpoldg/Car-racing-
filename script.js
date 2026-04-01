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

/* INIT */
function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("game"),
    antialias:true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.set(0,4,8);

  /* LIGHT */
  const light = new THREE.DirectionalLight(0xffffff,1);
  light.position.set(5,10,5);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff,0.6);
  scene.add(ambient);

  /* ROAD */
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(10,500),
    new THREE.MeshStandardMaterial({color:0x222222})
  );
  road.rotation.x = -Math.PI/2;
  scene.add(road);

  /* CAR (TEMP SAFE) */
  car = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,2),
    new THREE.MeshStandardMaterial({color:0x00ff00})
  );
  car.position.y = 0.5;
  scene.add(car);

  animate();
}

/* CONTROLS */
document.addEventListener("keydown", e=>keys[e.key]=true);
document.addEventListener("keyup", e=>keys[e.key]=false);

/* ENEMY */
function spawnEnemy(){
  let e = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,2),
    new THREE.MeshStandardMaterial({color:0xff0000})
  );
  e.position.set((Math.random()-0.5)*4,0.5,-80);
  scene.add(e);
  enemies.push(e);
}

/* LOOP */
function animate(){
  requestAnimationFrame(animate);

  if(gameRunning){

    if(keys["ArrowLeft"]) car.position.x -=0.1;
    if(keys["ArrowRight"]) car.position.x +=0.1;
    if(keys["ArrowUp"]) car.position.z -=0.2;

    car.position.x = Math.max(-3,Math.min(3,car.position.x));

    camera.position.x += (car.position.x - camera.position.x)*0.1;
    camera.position.z = car.position.z + 6;
    camera.lookAt(car.position);

    enemies.forEach(e=>{
      e.position.z +=0.4;

      if(e.position.distanceTo(car.position)<1.5){
        gameRunning=false;
        alert("Game Over");
      }

      if(e.position.z > car.position.z+10){
        e.position.z = car.position.z-100;
        score++;
        scoreEl.innerText="Score: "+score;
      }
    });
  }

  renderer.render(scene,camera);
}

/* START */
startBtn.onclick = ()=>{
  gameRunning=true;
  engine.play().catch(()=>{});
  startBtn.style.display="none";
};

/* RESTART */
restartBtn.onclick = ()=>location.reload();

/* START GAME */
init();
setInterval(spawnEnemy,1200);
