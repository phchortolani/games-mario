const mario = document.querySelector('.mario');
const bird = document.querySelector('.bird');
const view = document.querySelector(".view");
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector(".clouds");
const score = document.querySelectorAll('.score');
const gameOverMsg = document.querySelector('.gameOverMsg');
var socket = io();

var scoreValue = 1;
var controlPointer = true;

class FlappyBird {
    isEndGame = false;
    actionsKeys = {
        up: "w",
        right: "d",
        down: "s",
        left: "a",
        specialAction: "e"
    }
}

class Mario {

    actionsKeys = {
        jump: "Space"
    }

    jump() {

        if (!mario.classList.value.includes("jump")) mario.classList.add("jump");
        setTimeout(() => {
            mario.classList.remove("jump");
            controlPointer = true;
        }, 700)
    }
}

let birdCoordinate = {
    y: 0,
    x: 0
}

socket.on("movedBird", (e) => {
    move(e.x, e.y)
})

socket.on("jumpedMario", () => {
    const m = new Mario();
    return m.jump()
})

function move(x, y) {
    birdCoordinate.x = x;
    birdCoordinate.y = y;
    document.documentElement.style.setProperty('--bird-y', `${y}%`)
    document.documentElement.style.setProperty('--bird-x', `${x}%`)

}
function moveBird(x, y) {
    socket.emit('moveBird', birdCoordinate)
    move(x, y)
}

document.addEventListener('keydown', (e) => keyPress(e));
//document.addEventListener('click', (e) => socket.emit('jumpMario'));

async function keyPress(e) {
    const distanceBirdToMove = 10;
    const { actionsKeys: marioActions, jump: marioJump } = new Mario();
    const BirdActions = new FlappyBird().actionsKeys;
    if (e.code == marioActions.jump) return socket.emit('jumpMario');

    if (e.key == BirdActions.up) birdCoordinate.y -= distanceBirdToMove;
    if (e.key == BirdActions.right) birdCoordinate.x += distanceBirdToMove;
    if (e.key == BirdActions.down) birdCoordinate.y += distanceBirdToMove;
    if (e.key == BirdActions.left) birdCoordinate.x -= distanceBirdToMove;

    limitRangeBird();

    const { y, x } = birdCoordinate;

    moveBird(x, y)

}


function limitRangeBird() {
    if (birdCoordinate.x > 90) birdCoordinate.x = 95;
    if (birdCoordinate.y > 85) birdCoordinate.y = 80;
    if (birdCoordinate.y < 0) birdCoordinate.y = 0;
    if (birdCoordinate.x < 0) birdCoordinate.x = 0;
}


class CoreFunctions {
    pipePosition;
    marioPosition;
    viewWidth;
    cloudPosition;

    constructor(pipePosition, marioPosition) {
        this.pipePosition = pipePosition;
        this.marioPosition = marioPosition;
        this.viewWidth = document.querySelector(".view").offsetWidth;
        this.cloudPosition = document.querySelector('.clouds').offsetLeft;
    }

    game = {
        automaticMario: () => this.runAutomaticMario(this.pipePosition),
        endGame: () => this.endGame(this.marioPosition, this.pipePosition),
        toScore: () => this.toScore(),
    }

    endGame() {
        const marioP = this.marioPosition;
        const pipeP = this.pipePosition;
        const cloudsP = this.cloudPosition;

        function stopMario() {
            mario.style.animation = 'none';
            mario.style.bottom = marioP + "px";
            mario.src = "./sprites/smw_mario_death.png";
            mario.style.width = "60px";
            mario.style.marginLeft = "40px";
        }
        function stopClouds() {
            clouds.style.animation = 'none';
            clouds.style.left = cloudsP + "px";
            clouds.classList.add("cloudsEnd");
        }
        function stopPipe() {
            pipe.style.animation = 'none';
            pipe.style.left = pipeP + "px";
        }
        function stopBird() {
            bird.classList.add("birdDead")
        }
        function showEndMsg() {
            gameOverMsg.classList.remove("d-none")
            document.querySelector(".dScore").classList.add("d-none");
        }
        stopPipe();
        stopMario();
        stopClouds();
        stopBird();
        showEndMsg();


        clearInterval(isRunning);
    }

    runAutomaticMario(pipePosition) {
        if (pipePosition < 300) {
            new Mario().jump();
        };
    }

    toScore() {
        if (controlPointer) {
            controlPointer = false;
            score.forEach((e) => e.innerHTML = scoreValue)
            scoreValue++;
        }
    }

}


const isRunning = setInterval(() => {
    const pipePosition = pipe.offsetLeft
    const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");
    const core = new CoreFunctions(pipePosition, marioPosition)

    //  core.game.automaticMario();

    if (pipePosition <= 100 && pipePosition > 0 && marioPosition < 75) {
        socket.emit("end", core)
    }
    if (pipe.offsetLeft < 0) {
        core.game.toScore();
    }
}, 10)

socket.on("endGame", (core) => {
    const { pipePosition, marioPosition } = core;
    const c = new CoreFunctions(pipePosition, marioPosition)
    c.game.endGame();
})


socket.on("started", () => {
    document.location.reload()
})
function reset() {

    socket.emit("start")
}





