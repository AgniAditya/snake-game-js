import { SnakeBoard } from "./snakeBoard.js";

const boardElement = document.querySelector(".board");
const highScoreElement = document.querySelector("#highest-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");
const modal = document.querySelector(".modal");
const startgamebtn = document.querySelector(".btn-start");

const snakeGame = new SnakeBoard(
  boardElement,
  scoreElement,
  highScoreElement,
  timeElement
);
snakeGame.init();

startgamebtn.addEventListener('click', () => {
  modal.style.display = "none";
  snakeGame.startGame()
})