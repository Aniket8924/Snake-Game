const board = document.querySelector('.grid-part');
const boardWidth = 28;
const boardHeight = 28;
const startBtn = document.querySelector('.btn1');
const closeBtn = document.querySelector('.btn2');
const gameOver = document.querySelector('.gameOver');
const gameStart = document.querySelector('.gameStart');
const modal = document.querySelector('.modal');
let score = document.querySelector('.score');
let timer = document.querySelector('.timer');
let highScore = document.querySelector('.highScore');

let maxScore = 0;
let points = 0;
let time = `00:00`;

const blocks = {}; // changed from [] to {}
let snake = [
  { x: 1, y: 13 },
  { x: 1, y: 14 }
];

let direction = 'left';
let intervalId = null;

let cols = Math.floor(board.clientWidth / boardWidth);
let rows = Math.floor(board.clientHeight / boardHeight);

function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

let food = generateFood();

// Build the grid
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement('div');
    block.classList.add('block');
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head;

  if (direction === 'left') head = { x: snake[0].x, y: snake[0].y - 1 };
  else if (direction === 'right') head = { x: snake[0].x, y: snake[0].y + 1 };
  else if (direction === 'down') head = { x: snake[0].x + 1, y: snake[0].y };
  else if (direction === 'up') head = { x: snake[0].x - 1, y: snake[0].y };

  // Check for food
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove('food');
    food = generateFood();
    blocks[`${food.x}-${food.y}`].classList.add('food');
    snake.unshift(head);


    points+=10;
    
    score.innerText=points;

  } 
    

  // Wall collision
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    modal.style.display = 'flex';
    gameStart.style.display = 'none';
    gameOver.style.display = 'flex';
    return;
  }

  // Render snake
  Object.values(blocks).forEach(block => block.classList.remove('fill'));
  snake.forEach(segment => blocks[`${segment.x}-${segment.y}`].classList.add('fill'));
  blocks[`${food.x}-${food.y}`].classList.add('food');
}

startBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  intervalId = setInterval(() => render(), 300);
});

closeBtn.addEventListener('click', restartGame);

function restartGame() {
  clearInterval(intervalId);
  modal.style.display = 'none';
  gameOver.style.display = 'none';
  gameStart.style.display = 'none';

  Object.values(blocks).forEach(block => {
    block.classList.remove('fill', 'food');
  });

  direction = 'down';
  snake = [
    { x: 1, y: 13 },
    { x: 1, y: 14 }
  ];

  food = generateFood();
  intervalId = setInterval(() => render(), 300);
}

addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  else if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
  else if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  else if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
});
