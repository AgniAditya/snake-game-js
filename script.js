import { SnakeBoard } from "./snakeBoard.js";

const boardElement = document.querySelector(".board");
const highScoreElement = document.querySelector("#highest-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const snakeGame = new SnakeBoard(
  boardElement,
  scoreElement,
  highScoreElement,
  timeElement
);

snakeGame.init();

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") snakeGame.startGame();
  else if (event.key === "Escape") snakeGame.stopGame();
});