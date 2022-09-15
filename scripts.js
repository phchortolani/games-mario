const mario = document.querySelector('.mario');
const clouds = document.querySelector('.clouds');
const pipe = document.querySelector('.pipe');
const score = document.querySelectorAll('.score');
const gameOverMsg = document.querySelector('.gameOverMsg');
var scoreValue = 1;
var controPointer = true;
const keys = {
    jump: "Space"
}

document.addEventListener('keydown', (e) => jump(e));
document.addEventListener('click', (e) => jump({ code: keys.jump }));

const jump = (e) => {
    if (e.code == keys.jump && !mario.classList.contains("jump")) {
        mario.classList.add("jump");
        setTimeout(() => mario.classList.remove("jump"), 700)
        controPointer = true;
    }

}

const HasRunning = setInterval(() => {

    const pipePosition = pipe.offsetLeft
    const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");

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
    if (controPointer) {
        controPointer = false;
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