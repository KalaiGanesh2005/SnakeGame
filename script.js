// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn'); // Restart Button
const difficultySelect = document.getElementById('difficulty');

// Game parameters
const snakeSize = 20;
let snake, food, dx, dy, score, highScore = 0, gameInterval, difficulty, isGameOver;

// Load sound effects
const moveSound = new Audio('change_direction.wav');
const eatSound = new Audio('eat_food.wav');
const gameOverSound = new Audio('game_over.wav');
const highScoreSound = new Audio('high_score.wav');

// Difficulty settings
const difficultyLevels = {
    easy: 150,
    medium: 100,
    hard: 50
};

// Initialize the game
function initGame() {
    snake = [{ x: 200, y: 200 }];
    food = spawnFood();
    dx = snakeSize;
    dy = 0;
    score = 0;
    isGameOver = false;

    // Enable/Disable Buttons
    startBtn.disabled = true;
    restartBtn.disabled = true;
}

// Draw the snake and food on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff7e5f');
    gradient.addColorStop(1, '#feb47b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake (Green Square)
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'darkgreen' : 'lightgreen';
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });

    // Draw food (Red Square)
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);

    // Update score
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;
}

// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Game over conditions (Wall collision & Self collision)
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameInterval);
        isGameOver = true;
        gameOverSound.play();
        alert('Game Over! Click Restart to play again.');
        
        // Enable Restart Button
        restartBtn.disabled = false;
        return;
    }

    snake.unshift(head);

    // Snake eats food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        eatSound.play();
        food = spawnFood();

        if (score > highScore) {
            highScore = score;
            highScoreSound.play();
        }
    } else {
        snake.pop();
    }
}

// Ensure food spawns at correct grid positions
function spawnFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
        y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
    } while (snake.some(segment => segment.x === x && segment.y === y));
    return { x, y };
}

// Change snake direction and play movement sound
function changeDirection(event) {
    if (event.keyCode === 37 && dx === 0) { 
        dx = -snakeSize;
        dy = 0;
        moveSound.play();
    } else if (event.keyCode === 38 && dy === 0) { 
        dx = 0;
        dy = -snakeSize;
        moveSound.play();
    } else if (event.keyCode === 39 && dx === 0) { 
        dx = snakeSize;
        dy = 0;
        moveSound.play();
    } else if (event.keyCode === 40 && dy === 0) { 
        dx = 0;
        dy = snakeSize;
        moveSound.play();
    }
}

// Start the game
function startGame() {
    initGame();
    gameInterval = setInterval(() => {
        moveSnake();
        draw();
    }, difficultyLevels[difficulty]);

    document.addEventListener('keydown', changeDirection);
    startBtn.disabled = true;
}

// Restart the game
function restartGame() {
    clearInterval(gameInterval);
    startGame();
    restartBtn.disabled = true;
}

// Stop the game
function stopGame() {
    clearInterval(gameInterval);
    document.removeEventListener('keydown', changeDirection);
    startBtn.disabled = false;
}

// Set difficulty level
difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
});

// Event listeners for start and restart buttons
startBtn.addEventListener('click', () => {
    if (isGameOver) stopGame();
    difficulty = difficultySelect.value;
    startGame();
});

restartBtn.addEventListener('click', restartGame);
