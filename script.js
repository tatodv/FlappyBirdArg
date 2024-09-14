const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables del pájaro
let bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.6,
    lift: -10,
    velocity: 0
};

// Variables de las tuberías
let pipes = [];
let pipeWidth = 52;
let pipeGap = 120;
let frameCount = 0;

// Variables del juego
let score = 0;
let gameOver = false;

// Control del juego
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        bird.velocity += bird.lift;
    }
});

// Función para dibujar el pájaro
function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Funciones para las tuberías
function createPipe() {
    let topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    let bottomHeight = canvas.height - topHeight - pipeGap;

    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: topHeight,
        passed: false
    });

    pipes.push({
        x: canvas.width,
        y: canvas.height - bottomHeight,
        width: pipeWidth,
        height: bottomHeight,
        passed: false
    });
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(function(pipe) {
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });
}

function updatePipes() {
    pipes.forEach(function(pipe) {
        pipe.x -= 2;

        // Incrementar puntuación
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score += 0.5; // Se suma 0.5 porque hay dos segmentos por tubería
        }
    });

    // Eliminar tuberías que ya pasaron
    if (pipes.length > 0 && pipes[0].x + pipes[0].width < 0) {
        pipes.splice(0, 2);
    }
}

// Función para detectar colisiones
function checkCollision() {
    // Colisión con el suelo o techo
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
    }

    // Colisión con las tuberías
    pipes.forEach(function(pipe) {
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y
        ) {
            gameOver = true;
        }
    });
}

// Función para reiniciar el juego
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
    gameOver = false;
}

// Función para dibujar la puntuación
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Puntuación: ${Math.floor(score)}`, 10, 30);
}

// Función principal de dibujo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    drawScore();
}

// Función principal de actualización
function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (frameCount % 90 === 0) {
        createPipe();
    }

    updatePipes();
    checkCollision();
}

// Bucle del juego
function gameLoop() {
    if (gameOver) {
        alert(`¡Juego terminado! Puntuación final: ${Math.floor(score)}`);
        resetGame();
    } else {
        draw();
        update();
        frameCount++;
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
