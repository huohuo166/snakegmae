class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.snake = [
            {x: 10, y: 10}
        ];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.init();
    }
    
    init() {
        this.generateFood();
        this.updateScore();
        this.updateHighScore();
        this.setupEventListeners();
        this.draw();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.changeDirection(e));
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            if (this.dx === 0 && this.dy === 0) {
                this.dx = 1;
            }
            this.gameLoop();
        }
    }
    
    pauseGame() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            if (!this.gamePaused) {
                this.gameLoop();
            }
        }
    }
    
    restartGame() {
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.generateFood();
        this.updateScore();
        this.draw();
    }
    
    gameLoop() {
        if (this.gamePaused || !this.gameRunning) return;
        
        setTimeout(() => {
            this.update();
            this.draw();
            
            if (this.gameRunning) {
                this.gameLoop();
            }
        }, 100);
    }
    
    update() {
        if (this.dx === 0 && this.dy === 0) return;
        
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    checkCollision(head) {
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                return true;
            }
        }
        
        return false;
    }
    
    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        
        for (let segment of this.snake) {
            if (this.food.x === segment.x && this.food.y === segment.y) {
                this.generateFood();
                return;
            }
        }
    }
    
    draw() {
        this.ctx.fillStyle = '#1a202c';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#48bb78';
        for (let segment of this.snake) {
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        }
        
        this.ctx.fillStyle = '#f56565';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        
        this.ctx.fillStyle = '#68d391';
        this.ctx.fillRect(this.snake[0].x * this.gridSize, this.snake[0].y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    }
    
    changeDirection(event) {
        if (!this.gameRunning) return;
        
        const keyPressed = event.keyCode;
        const goingUp = this.dy === -1;
        const goingDown = this.dy === 1;
        const goingRight = this.dx === 1;
        const goingLeft = this.dx === -1;
        
        if (keyPressed === 37 && !goingRight) {
            this.dx = -1;
            this.dy = 0;
        }
        if (keyPressed === 38 && !goingDown) {
            this.dx = 0;
            this.dy = -1;
        }
        if (keyPressed === 39 && !goingLeft) {
            this.dx = 1;
            this.dy = 0;
        }
        if (keyPressed === 40 && !goingUp) {
            this.dx = 0;
            this.dy = 1;
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateHighScore();
        }
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束!', this.canvas.width / 2, this.canvas.height / 2 - 40);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText('点击重新开始', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
    
    updateHighScore() {
        document.getElementById('high-score').textContent = this.highScore;
    }
}

const game = new SnakeGame();