const mario = document.querySelector('.mario');
const bird = document.querySelector('.bird');
const view = document.querySelector(".view")
const clouds = document.querySelector('.clouds');
const pipe = document.querySelector('.pipe');
const score = document.querySelectorAll('.score');
const gameOverMsg = document.querySelector('.gameOverMsg');

var scoreValue = 1;
var controlPointer = true;
const keys = {
    jump: "Space",
    bird: {
        up: "w",
        right: "d",
        down: "s",
        left: "a"
    }
}
var birdCoordinate = { y: 0, x: 0 }

document.addEventListener('keydown', (e) => keyPress(e));
document.addEventListener('click', (e) => jump({ code: keys.jump }));

function keyPress(e) {
    const distanceBirdToMove = 10;
    if (e.code == keys.jump && !mario.classList.contains("jump")) return jump(e)

    if (e.key == keys.bird.up) {
        birdCoordinate.y -= distanceBirdToMove;
    }
    if (e.key == keys.bird.right) {
        birdCoordinate.x += distanceBirdToMove;

    }
    if (e.key == keys.bird.down) {
        birdCoordinate.y += distanceBirdToMove;
    }
    if (e.key == keys.bird.left) {
        birdCoordinate.x -= distanceBirdToMove;
    }

    limitarPassarinho();

    document.documentElement.style.setProperty('--bird-y', `${birdCoordinate.y}%`)
    document.documentElement.style.setProperty('--bird-x', `${birdCoordinate.x}%`)
}


function limitarPassarinho() {

    if (birdCoordinate.x > 90) {
        birdCoordinate.x = 95;
    }
    if (birdCoordinate.y > 85) {
        birdCoordinate.y = 80;
    }
    if (birdCoordinate.y < 0) {
        birdCoordinate.y = 0;
    }
    if (birdCoordinate.x < 0) {
        birdCoordinate.x = 0;
    }
}


const jump = (e) => {
    mario.classList.add("jump");
    setTimeout(() => mario.classList.remove("jump"), 700)
    controlPointer = true;

}

const HasRunning = setInterval(() => {
    const pipePosition = pipe.offsetLeft
    const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");
    //mario automatico
    if (pipePosition < 300 ) {
        jump({ code: keys.jump })
    };
    if (pipePosition <= 100 && pipePosition > 0 && marioPosition < 75) {
        endGame(marioPosition, pipePosition);
    }
    if (pipe.offsetLeft < 0) {
        pontuar()
    }
}, 10)


function reset() {
    document.location.reload();
}

function pontuar() {
    if (controlPointer) {
        controlPointer = false;
        score.forEach((e) => e.innerHTML = scoreValue)
        scoreValue++;
    }
}
function endGame(marioPosition, pipePosition) {
    const cloudsPosition = clouds.offsetLeft


    pipe.style.animation = 'none';
    pipe.style.left = pipePosition + "px";
    mario.style.animation = 'none';
    clouds.style.animation = 'none';
    mario.style.bottom = marioPosition + "px";
    clouds.style.left = cloudsPosition + "px";
    mario.src = "./sprites/smw_mario_death.png";
    mario.style.width = "60px";
    mario.style.marginLeft = "40px";
    gameOverMsg.classList.remove("d-none")
    document.querySelector(".dScore").classList.add("d-none");

    clearInterval(HasRunning);
}