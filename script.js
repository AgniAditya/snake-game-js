import { SnakeBoard } from "./snakeBoard.js";

const board = document.querySelector('.board');
const highestScore = document.querySelector("#highest-score")
const score = document.querySelector("#score")
const time = document.querySelector("#time")

const snakeBoard = new SnakeBoard(board,score,highestScore,time)
snakeBoard.init()
window.addEventListener("keydown", (event) => {
    if(event.key === "Enter") snakeBoard.startGame();
    else if(event.key === "Escape") snakeBoard.stopGame();
})