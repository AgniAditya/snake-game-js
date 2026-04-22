const gameBoard = document.querySelector('.board');

const BLOCK_WIDTH = 30;
const BLOCK_HEIGHT = 30;

function renderBoardGrid() {
    gameBoard.innerHTML = "";

    const columns = Math.floor(gameBoard.clientWidth / BLOCK_WIDTH);
    const rows = Math.floor(gameBoard.clientHeight / BLOCK_HEIGHT);

    const totalCells = columns * rows;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.classList.add("block");
        gameBoard.appendChild(cell);
    }
}

window.addEventListener('resize', renderBoardGrid);

renderBoardGrid();