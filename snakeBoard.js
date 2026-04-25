export class SnakeBoard {
    #BLOCK_WIDTH = 50;
    #BLOCK_HEIGHT = 50;

    constructor(board, scoreElement, highestScoreElement, timerElement) {
        this.board = board;
        this.scoreElement = scoreElement;
        this.highestScoreElement = highestScoreElement;
        this.timerElement = timerElement;
    }

    init() {
        this.snake = [];
        this.snakeDirection = [0, 1];
        this.score = 0;

        this.scoreElement.textContent = this.score;
        this.timerElement.textContent = "00:00";

        this.snake.push(
            { row: 0, column: 0 },
            { row: 0, column: 1 },
            { row: 0, column: 2 },
            { row: 0, column: 3 }
        );

        this.renderBoardGrid();
        this.renderSnakeBlocks();
        this.renderTargetBlock();
        this.renderHighestScore();
    }

    startGame() {
        if (this.isGameOn) return;
        this.isGameOn = true;
        window.addEventListener("keydown", (event) => {
            const [currentRowDir, currentColDir] = this.snakeDirection;

            switch (event.key) {
                case "ArrowUp":
                    if (currentRowDir !== 1) {
                        this.snakeDirection = [-1, 0];
                    }
                    break;

                case "ArrowDown":
                    if (currentRowDir !== -1) {
                        this.snakeDirection = [1, 0];
                    }
                    break;

                case "ArrowLeft":
                    if (currentColDir !== 1) {
                        this.snakeDirection = [0, -1];
                    }
                    break;

                case "ArrowRight":
                    if (currentColDir !== -1) {
                        this.snakeDirection = [0, 1];
                    }
                    break;
            }
        });

        this.startTime = Date.now();

        this.timerInterval = setInterval(() => {
            const elapsedMs = Date.now() - this.startTime;
            const totalSeconds = Math.floor(elapsedMs / 1000);

            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            const formattedTime =
                String(minutes).padStart(2, "0") +
                ":" +
                String(seconds).padStart(2, "0");

            this.timerElement.textContent = formattedTime;
        }, 1000);

        this.gameInterval = setInterval(() => {
            const head = this.snake[this.snake.length - 1];
            const tail = this.snake[0];

            const lastCell = this.getCell(tail.row, tail.column);

            const newRow = head.row + this.snakeDirection[0];
            const newColumn = head.column + this.snakeDirection[1];

            const newCell = this.getCell(newRow, newColumn);

            const isCollided = this.snake.find((pos) => {
                return pos.row === newRow && pos.column === newColumn;
            });

            const { rows, columns } = this.getBoardDimensions();

            const isInBounds =
                newRow >= 0 &&
                newRow < rows &&
                newColumn >= 0 &&
                newColumn < columns;

            if (isCollided || !isInBounds) {
                this.stopGame();
                return;
            }

            const isTargetHit =
                this.target.row === newRow &&
                this.target.column === newColumn;

            if (isTargetHit) {
                newCell.classList.remove("target-block");
                this.scoreElement.textContent = ++this.score;
                this.renderTargetBlock();
            } else {
                this.snake.shift();
                lastCell.classList.remove("snake-block");
            }

            this.snake.push({
                row: newRow,
                column: newColumn,
            });

            newCell.classList.add("snake-block");
        }, 250);
    }

    stopGame() {
        if(!this.isGameOn) return;
        this.isGameOn = false;
        clearInterval(this.timerInterval);
        clearInterval(this.gameInterval);
        this.updateHighestScore();
        this.init();
        this.renderRestartModal();
    }

    renderRestartModal(){
        const modal = document.createElement("div");
        modal.classList.add("modal");

        const startgame = document.createElement("div");
        startgame.classList.add("start-game");

        const h2 = document.createElement("h2");
        h2.textContent = "Restart your game";

        const restartgamebtn = document.createElement('button');
        restartgamebtn.classList.add("btn")
        restartgamebtn.textContent = "Restart game"
        restartgamebtn.addEventListener('click', () => {
            modal.style.display = "none";
            this.startGame()
        })

        startgame.appendChild(h2);
        startgame.appendChild(restartgamebtn);

        modal.appendChild(startgame);
        document.querySelector("main").appendChild(modal)
    }

    renderBoardGrid() {
        this.clearGameBoard();

        const { rows, columns } = this.getBoardDimensions();

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const cell = document.createElement("div");
                cell.classList.add("block");
                cell.setAttribute("data-row", row);
                cell.setAttribute("data-column", column);
                this.board.appendChild(cell);
            }
        }
    }

    renderSnakeBlocks() {
        this.snake.forEach(({ row, column }) => {
            const cell = this.getCell(row, column);
            cell.classList.add("snake-block");
        });
    }

    renderTargetBlock() {
        const { rows, columns } = this.getBoardDimensions();

        this.target = this.getRandomCell(rows, columns);

        const cell = this.getCell(this.target.row, this.target.column);
        cell.classList.add("target-block");
    }

    renderHighestScore() {
        const highestScore = localStorage.getItem("highestscore");

        if (highestScore) {
            this.highestScoreElement.textContent = highestScore;
        } else {
            localStorage.setItem("highestscore", 0);
            this.highestScoreElement.textContent = 0;
        }
    }

    updateHighestScore() {
        const highestScore = localStorage.getItem("highestscore");

        if (this.score > Number(highestScore)) {
            localStorage.setItem("highestscore", this.score);
        }
    }

    getRandomCell(rows, columns) {
        const newRow = Math.floor(Math.random() * rows);
        const newColumn = Math.floor(Math.random() * columns);

        return { row: newRow, column: newColumn };
    }

    getBoardDimensions() {
        const columns = Math.floor(this.board.clientWidth / this.#BLOCK_WIDTH);
        const rows = Math.floor(this.board.clientHeight / this.#BLOCK_HEIGHT);

        return { rows, columns };
    }

    clearGameBoard() {
        this.board.innerHTML = "";
    }

    getCell(row, column) {
        return document.querySelector(
            `[data-row="${row}"][data-column="${column}"]`
        );
    }
}