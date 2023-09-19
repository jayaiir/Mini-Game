// Game variables
let player;
let asteroids = [];
let items = [];
let itemsCollected = 0;
let lives = 3;

// Canvas context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Key Presses
let keys = {};

// Player object - represented by a triangle
function Player() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 20;
    this.dx = 0; // velocity along x-axis
    this.dy = 0; // velocity along y-axis

    this.draw = function() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size / 2);
        ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
        ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
        ctx.closePath();
        ctx.fill();
    };

    this.move = function() {
        if (keys['ArrowRight']) this.dx += 0.1;
        if (keys['ArrowLeft']) this.dx -= 0.1;
        if (keys['ArrowUp']) this.dy -= 0.1;
        if (keys['ArrowDown']) this.dy += 0.1;

        this.x += this.dx;
        this.y += this.dy;

        this.dx *= 0.9; // friction
        this.dy *= 0.9; // friction

        // Loop player position around the screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    };

    this.checkCollision = function(other) {
        let dx = this.x - other.x;
        let dy = this.y - other.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.size / 2) + (other.size / 2);
    };
}

// Asteroid object - represented by squares
function Asteroid() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 30 + 20;
    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 2 - 1;

    this.draw = function() {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    };

    this.move = function() {
        this.x += this.dx;
        this.y += this.dy;

        // Loop asteroid position around the screen
        if(this.x < 0) this.x = canvas.width;
        if(this.x > canvas.width) this.x = 0;
        if(this.y < 0) this.y = canvas.height;
        if(this.y > canvas.height) this.y = 0;
    };
}

// Item object - represented by circles
function Item() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = 10;

    this.draw = function() {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    };
}

// Game setup
function setup() {
    player = new Player();

    // Create asteroids
    for(let i = 0; i < 10; i++) {
        asteroids.push(new Asteroid());
    }

    // Create first item
    items.push(new Item());
}

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update player
    player.draw();
    player.move();

    // Draw and update asteroids
    asteroids.forEach((asteroid, index) => {
        asteroid.draw();
        asteroid.move();
        // Check collision with player
        if(player.checkCollision(asteroid)) {
            lives--;
            // Remove the asteroid that hit the player and add a new one
            asteroids.splice(index, 1);
            asteroids.push(new Asteroid());
            if(lives <= 0) {
                endGame();
            }
        }
    });

    // Draw and update item
    let item = items[0];
    item.draw();
    // Check collision with player
    if(player.checkCollision(item)) {
        itemsCollected++;
        // Remove the collected item and add a new one
        items.splice(0, 1);
        if(itemsCollected < 5) {
            items.push(new Item());
        } else {
            winGame();
        }
    }

    // Display score and lives
    document.getElementById('score').textContent = "Items Collected: " + itemsCollected;
    document.getElementById('lives').textContent = "Lives: " + lives;

    // Continue the game loop if the game is not over
    if(lives > 0 && itemsCollected < 5) {
        requestAnimationFrame(gameLoop);
    }
}

// Start the game
setup();
gameLoop();

// End game
function endGame() {
    document.getElementById('message').textContent = 'Game Over. You collected ' + itemsCollected + ' items.';
    document.getElementById('popup').style.display = 'flex';
}

// Win game
function winGame() {
    document.getElementById('message').textContent = 'You win! You are a great pilot!';
    document.getElementById('popup').style.display = 'flex';
}

// Event listener for keydown
window.addEventListener('keydown', function(event) {
    keys[event.code] = true;
});

// Event listener for keyup
window.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});

document.getElementById('restart').addEventListener('click', function() {
    // Reset game variables
    player = new Player();
    asteroids = [];
    for(let i = 0; i < 10; i++) {
        asteroids.push(new Asteroid());
    }
    items = [new Item()];
    itemsCollected = 0;
    lives = 3;

    // Hide the pop-up and start the game loop again
    document.getElementById('popup').style.display = 'none';
    gameLoop();
});