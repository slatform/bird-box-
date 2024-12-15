const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

// Game variables
let bird = { x: 50, y: 300, width: 20, height: 20, dy: 0 };
let gravity = 0.5;
let lift = -8;
let obstacles = [];
let score = 0;
document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowUp') bird.dy = lift;
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowUp') bird.dy = 0; // Stop upward movement
});
function generateObstacle() {
    const gap = 150;
    const height = Math.random() * (canvas.height - gap);
    obstacles.push({
        x: canvas.width,
        topHeight: height,
        bottomHeight: canvas.height - height - gap,
        width: 30
    });
}

function updateObstacles() {
    obstacles.forEach((obs) => {
        obs.x -= 2; // Move left
    });

    // Remove off-screen obstacles
    obstacles = obstacles.filter((obs) => obs.x + obs.width > 0);

    // Add new obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
        generateObstacle();
    }
}function updateGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Gravity effect
    bird.dy += gravity;
    bird.y += bird.dy;

    // Prevent bird from falling off the screen
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.dy = 0;
    }

    // Update obstacles
    updateObstacles();

    // Draw obstacles
    obstacles.forEach((obs) => {
        ctx.fillStyle = 'green';
        ctx.fillRect(obs.x, 0, obs.width, obs.topHeight); // Top part
        ctx.fillRect(obs.x, canvas.height - obs.bottomHeight, obs.width, obs.bottomHeight); // Bottom part
    });

    // Collision detection
    obstacles.forEach((obs) => {
        if (
            bird.x < obs.x + obs.width &&
            bird.x + bird.width > obs.x &&
            (bird.y < obs.topHeight || bird.y + bird.height > canvas.height - obs.bottomHeight)
        ) {
            alert('Game Over! Your score: ' + score);
            document.location.reload();
        }
    });

    // Update score
    score++;
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    // Loop
    requestAnimationFrame(updateGame);
}

generateObstacle();
updateGame();

