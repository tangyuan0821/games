const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const gridSize = 20;
const totalCells = gridSize * gridSize;
let snake = [21, 20];
let direction = 1;
let food = generateFood();
let score = 0;
let gameInterval;
let isPaused = false; // 新增暂停状态

// 初始化游戏板
function initBoard() {
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    board.appendChild(cell);
  }
}

// 绘制游戏状态
function draw() {
  const cells = document.querySelectorAll('.cell');

  // 重置所有格子
  cells.forEach(cell => {
    cell.className = 'cell';
    cell.classList.remove('snake', 'head', 'food');
  });

  // 绘制蛇身
  snake.slice(1).forEach(segment => {
    cells[segment].classList.add('snake');
  });

  // 绘制蛇头
  if (snake.length > 0) {
    cells[snake[0]].classList.add('snake', 'head');
  }

  // 绘制食物
  cells[food].classList.add('food');

  // 更新分数
  scoreDisplay.textContent = score;
}

// 蛇移动逻辑
function moveSnake() {
  if (isPaused) return;

  const newHead = snake[0] + direction;

  // 边界检测
  const hitLeftWall = (direction === -1 && snake[0] % gridSize === 0);
  const hitRightWall = (direction === 1 && snake[0] % gridSize === gridSize - 1);

  if (
    newHead < 0 ||
    newHead >= totalCells ||
    hitLeftWall ||
    hitRightWall ||
    snake.includes(newHead)
  ) {
    gameOver();
    return;
  }

  snake.unshift(newHead);

  // 吃食物检测
  if (newHead === food) {
    score += 10;
    food = generateFood();
  } else {
    snake.pop();
  }

  draw();
}

// 生成食物（避开蛇身）
function generateFood() {
  let newFood;
  do {
    newFood = Math.floor(Math.random() * totalCells);
  } while (snake.includes(newFood));
  return newFood;
}

// 键盘控制
function handleKeydown(e) {
  switch(e.key) {
    case 'ArrowLeft':
      if (direction !== 1) direction = -1;
      break;
    case 'ArrowRight':
      if (direction !== -1) direction = 1;
      break;
    case 'ArrowUp':
      if (direction !== gridSize) direction = -gridSize;
      break;
    case 'ArrowDown':
      if (direction !== -gridSize) direction = gridSize;
      break;
    case ' ': // 空格暂停
      togglePause();
      break;
  }
}

// 游戏控制
function startGame() {
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(moveSnake, 150);
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById('pause-btn').textContent =
    isPaused ? '继续' : '暂停';
}

function gameOver() {
  clearInterval(gameInterval);
  alert(`游戏结束！得分: ${score}`);
  resetGame();
}

function resetGame() {
  snake = [21, 20];
  direction = 1;
  food = generateFood();
  score = 0;
  isPaused = false;
  startGame();
  draw();
}

// 触摸控制
let touchStartX = null;
let touchStartY = null;

function handleTouchStart(e) {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  e.preventDefault(); // 阻止页面滚动
}

function handleTouchMove(e) {
  if (!touchStartX || !touchStartY) return;

  const touch = e.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      deltaX > 0 && direction !== -1 && (direction = 1);
      deltaX < 0 && direction !== 1 && (direction = -1);
    } else {
      // 垂直滑动
      deltaY > 0 && direction !== -gridSize && (direction = gridSize);
      deltaY < 0 && direction !== gridSize && (direction = -gridSize);
    }
    touchStartX = null;
    touchStartY = null;
  }

  e.preventDefault();
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  initBoard();
  draw();
  startGame();

  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('touchstart', handleTouchStart, {passive: false});
  document.addEventListener('touchmove', handleTouchMove, {passive: false});

  // 按钮事件绑定
  document.getElementById('reset-btn').addEventListener('click', resetGame);
  document.getElementById('pause-btn').addEventListener('click', togglePause);
});

