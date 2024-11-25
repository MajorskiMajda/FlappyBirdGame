let board;
let boardHeight = 640;
let boardWidth = 360;
let context;


let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImage;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImage;
let bottomPipeImage;

let velocityX = -2; 
let velocityY = 0;  
let gravity = 0.4;
let gameOver = false;
let score = 0;
let isGameStarted = false; 

window.onload = function () {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    birdImage = new Image();
    birdImage.src = './images/flappybird.png';
    birdImage.onload = function () {
        context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImage = new Image();
    topPipeImage.src = './images/toppipe.png';

    bottomPipeImage = new Image();
    bottomPipeImage.src = './images/bottompipe.png';

    requestAnimationFrame(update);
    setInterval(drawPipes, 1500);


    document.addEventListener('keydown', moveBird);
    document.addEventListener('keydown', restartGame);
    board.addEventListener('touchstart', moveBirdOnTouch);
    board.addEventListener('touchstart', restartGameOnTouch);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    if (isGameStarted) {
        velocityY += gravity;
    }
    bird.y += velocityY;

    if (bird.y < 0) {
        bird.y = 0;
        gameOver = true;
    }
    if (bird.y + bird.height > boardHeight) {
        bird.y = boardHeight - bird.height;
        velocityY = 0;
        gameOver = true;
    }

    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);


    if (isGameStarted) {
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 0.5;
                pipe.passed = true;
            }

            if (checkCollision(bird, pipe)) {
                gameOver = true;
            }
        }

        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
            pipeArray.shift();
        }
    }

    context.fillStyle = 'white';
    context.font = '45px sans-serif';
    context.fillText(score, 5, 45);


    if (gameOver) {
        context.fillText('GAME OVER', 5, 90);
    }
}

function drawPipes() {
    if (gameOver || !isGameStarted) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = boardHeight / 4;

    let topPipe = {
        img: topPipeImage,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImage,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }

    pipeArray.push(bottomPipe);
}
function moveBirdOnTouch(event) {
    if (!isGameStarted) {
        isGameStarted = true;  
    }

    velocityY = -6; 
    event.preventDefault(); 
}

function moveBird(event) {
    if (event.key == " " && !isGameStarted) {
        isGameStarted = true; 
    }

    if (event.key == " " && isGameStarted) {
        velocityY = -6; 
    }
    event.preventDefault();
}

function checkCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function restartGame(event) {

    if (event && event.key == "r" || !event) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
        isGameStarted = false;  
        velocityY = 0;  
        context.clearRect(0, 0, board.width, board.height); 
    }
}
function restartGameOnTouch(event) {
    if (gameOver) {
        restartGame();  
    }

    event.preventDefault(); 
}
