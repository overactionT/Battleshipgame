document.addEventListener('DOMContentLoaded', () => {
    const mySea = document.getElementById('my-sea');
    const enemySea = document.getElementById('enemy-sea');
    const startGameButton = document.getElementById('start-game');
    const winButton = document.getElementById('win-button');
    const loseButton = document.getElementById('lose-button');
    const buttonContainer = document.getElementById('button-container');
    let selectedCells = [];
    let shipSize = 0;
    let shipsPlaced = 0;
    let shipColor = '';
    let gameStarted = false;
    let myScore = 0;
    let enemyScore = 0;

    // 점수판 업데이트 함수
    function updateScoreBoard() {
        document.getElementById('my-score').textContent = myScore;
        document.getElementById('enemy-score').textContent = enemyScore;
    }

    // 게임 리셋 함수
    function resetGame(showAlert = true) {
        document.querySelectorAll('#my-sea td, #enemy-sea td').forEach(cell => {
            const rowIndex = cell.parentNode.rowIndex;
            const colIndex = cell.cellIndex;

            if (rowIndex === 0 || colIndex === 0) return;

            cell.dataset.state = '';
            cell.textContent = '';
            cell.style.backgroundColor = '';
            cell.style.border = '';
            cell.classList.remove('ship', 'selected');
        });

        shipSize = 0;
        shipsPlaced = 0;
        gameStarted = false;
        startGameButton.disabled = true;

        // Win/Lose 버튼 초기화 및 숨기기
        buttonContainer.style.display = 'none';
        winButton.disabled = true;
        loseButton.disabled = true;

        if (showAlert) {
            alert("Game has been reset. Place your ships again!");
        }
    }

    // 게임 시작 버튼 핸들러
    startGameButton.addEventListener('click', () => {
        if (!gameStarted && shipsPlaced === 3) {
            gameStarted = true;
            startGameButton.disabled = true;
            alert("Game has started!");

            // Win/Lose 버튼 활성화 및 표시
            buttonContainer.style.display = 'block';
            winButton.disabled = false;
            loseButton.disabled = false;
        }
    });

    // Win/Lose 버튼 클릭 시 게임 리셋
    winButton.addEventListener('click', () => {
        myScore++;
        updateScoreBoard();
        resetGame();
    });

    loseButton.addEventListener('click', () => {
        enemyScore++;
        updateScoreBoard();
        resetGame();
    });

    // 배의 크기 설정 함수
    function setShipSize(size, color) {
        if (shipsPlaced < 3) {
            shipSize = size;
            shipColor = color;
            selectedCells = [];
            alert("Place your battleship.");
        }
    }

    // 배 배치 처리 함수
    function handlePlaceShip(cell) {
        if (selectedCells.length < shipSize && !cell.classList.contains('selected')) {
            if (selectedCells.length === 0) {
                selectCell(cell);
            } else {
                const lastCell = selectedCells[selectedCells.length - 1];
                if (isAdjacent(lastCell, cell)) {
                    selectCell(cell);
                }
            }
        }

        if (selectedCells.length === shipSize) {
            if (checkShipPlacement(selectedCells)) {
                finalizeShipPlacement();
            } else {
                alert("Invalid ship placement! Try again.");
                resetSelectedCells();
            }
        }
    }

    // 셀 선택 처리 함수
    function selectCell(cell) {
        selectedCells.push(cell);
        cell.classList.add('selected');
        cell.style.backgroundColor = shipColor;
        cell.style.border = '2px solid black';
    }

    // 인접한 셀인지 확인하는 함수
    function isAdjacent(cell1, cell2) {
        const rowDiff = Math.abs(cell1.parentNode.rowIndex - cell2.parentNode.rowIndex);
        const colDiff = Math.abs(cell1.cellIndex - cell2.cellIndex);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    // 배치가 유효한지 확인하는 함수
    function checkShipPlacement(cells) {
        const rows = cells.map(cell => cell.parentNode.rowIndex);
        const cols = cells.map(cell => cell.cellIndex);
        const allInSameRow = rows.every(row => row === rows[0]);
        const allInSameCol = cols.every(col => col === cols[0]);

        if (allInSameRow) {
            return isConsecutive(cols);
        } else if (allInSameCol) {
            return isConsecutive(rows);
        }
        return false;
    }

    // 연속된 값인지 확인하는 함수
    function isConsecutive(arr) {
        arr.sort((a, b) => a - b);
        return arr.every((val, i) => i === 0 || val === arr[i - 1] + 1);
    }

    // 배치 완료 처리 함수
    function finalizeShipPlacement() {
        selectedCells.forEach(cell => cell.classList.add('ship'));
        shipsPlaced++;
        if (shipsPlaced === 3) {
            startGameButton.disabled = false;
            alert("All ships placed! Click 'Start Game' to begin.");
        }
    }

    // 선택된 셀 초기화 함수
    function resetSelectedCells() {
        selectedCells.forEach(cell => {
            cell.classList.remove('selected');
            cell.style.backgroundColor = '';
            cell.style.border = '';
        });
        selectedCells = [];
        shipSize = 0;
    }

    // 셀 클릭 상태 전환 함수
    function toggleCellState(cell) {
        cell.textContent = cell.textContent === 'X' ? '' : 'X';
    }

    // 셀 클릭 핸들러 설정 함수
    function setupCellClickHandlers() {
        document.querySelectorAll('#my-sea td').forEach(cell => {
            const rowIndex = cell.parentNode.rowIndex;
            const colIndex = cell.cellIndex;

            if (rowIndex === 0 || colIndex === 0) return;

            cell.addEventListener('click', () => {
                if (gameStarted) {
                    toggleCellState(cell);
                } else if (shipSize > 0) {
                    handlePlaceShip(cell);
                }
            });
        });

        document.querySelectorAll('#enemy-sea td').forEach(cell => {
            const rowIndex = cell.parentNode.rowIndex;
            const colIndex = cell.cellIndex;

            if (rowIndex === 0 || colIndex === 0) return;

            cell.addEventListener('click', () => {
                if (gameStarted) {
                    toggleCellState(cell);
                }
            });
        });
    }

    // 배치 버튼 클릭 핸들러 설정
    document.getElementById('set-ship-3').addEventListener('click', () => setShipSize(3, 'lightblue'));
    document.getElementById('set-ship-4').addEventListener('click', () => setShipSize(4, 'lightyellow'));
    document.getElementById('set-ship-5').addEventListener('click', () => setShipSize(5, 'lightgreen'));

    setupCellClickHandlers();
    resetGame(false); // 초기화 호출
});
