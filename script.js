let player=document.getElementById("player");
let game=document.getElementById("game");

let x=window.innerWidth/2 - 40;
let score=0;
let speed=5;
let running=false;
let angle=0;

function startGame(){
  running=true;
  score=0;
  loop();
  spawnEnemy();
}

function loop(){
  if(!running) return;

  player.style.left=x+"px";

  // 🎮 Steering tilt
  angle = (x - window.innerWidth/2) / 10;
  player.style.transform = `translateX(-50%) rotate(${angle}deg)`;

  // 💨 vibration effect
  player.style.bottom = (120 + Math.sin(score/5)*2) + "px";

  score++;
  document.getElementById("score").innerText=score;

  requestAnimationFrame(loop);
}

// 🎮 Smooth control
let wheel=document.getElementById("wheel");

wheel.addEventListener("touchmove",e=>{
  let touch=e.touches[0].clientX;
  x += (touch - x - 40) * 0.1;
});

// 🚗 ENEMY
function spawnEnemy(){
  if(!running) return;

  let e=document.createElement("img");
  e.src="https://cdn-icons-png.flaticon.com/512/743/743131.png";
  e.classList.add("enemy");

  let lane=[window.innerWidth*0.3, window.innerWidth*0.5, window.innerWidth*0.7];
  e.style.left=lane[Math.floor(Math.random()*3)]+"px";

  game.appendChild(e);

  let y=-100;

  function move(){
    if(!running) return;

    y+=speed*6;
    e.style.top=y+"px";

    let p=player.getBoundingClientRect();
    let er=e.getBoundingClientRect();

    if(p.left<er.right && p.right>er.left && p.top<er.bottom && p.bottom>er.top){
      running=false;
      alert("💥 Game Over\nScore: "+score);
      location.reload();
    }

    if(y<window.innerHeight){
      requestAnimationFrame(move);
    } else {
      e.remove();
    }
  }

  move();
  setTimeout(spawnEnemy,1000);
}
