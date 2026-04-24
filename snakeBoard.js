export class SnakeBoard {

    #BLOCK_WIDTH = 50;
    #BLOCK_HEIGHT = 50;

    constructor(board,scoreElement,highestSocre,timer) {
        this.board = board;
        this.scoreElement = scoreElement;
        this.highestSocre = highestSocre;
        this.timer = timer;
    }
    
    init() {
        this.snake = [];
        this.snakeDirection = [0, 1];
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.timer.textContent = "00:00"

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
        this.gameInterval;
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

            this.timer.textContent = "";
            this.timer.textContent = formattedTime;
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
                this.stopGame(this.gameInterval);
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
        }, 300);
    }

    stopGame() {
        clearInterval(this.timerInterval);
        clearInterval(this.gameInterval);
        this.updateHighestScore();
        this.init();
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
            const cell = this.getCell(row,column);
            cell.classList.add("snake-block");
        });
    }

    renderTargetBlock() {
        const { rows, columns } = this.getBoardDimensions();
        this.target = this.getRandomCell(rows, columns);

        const cell = this.getCell(this.target.row,this.target.column);

        cell.classList.add("target-block");
    }

    renderHighestScore(){
        const hgscore = localStorage.getItem("highestscore");
        if(hgscore){
            this.highestSocre.textContent = hgscore;
        }else{
            localStorage.setItem("highestscore",0)
            this.highestSocre.textContent = 0;
        }
    }

    updateHighestScore(){
        const hgscore = localStorage.getItem("highestscore");
        if(this.score > (hgscore * 1)) localStorage.setItem("highestscore",this.score)
    }

    getRandomCell(rows, columns) {
        const newRow = Math.floor(Math.random() * rows);
        const newColumn = Math.floor(Math.random() * columns);

        return { row: newRow, column: newColumn };
    }

    getBoardDimensions() {
        const columns = Math.floor(
            this.board.clientWidth / this.#BLOCK_WIDTH
        );
        const rows = Math.floor(
            this.board.clientHeight / this.#BLOCK_HEIGHT
        );

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