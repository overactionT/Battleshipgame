document.addEventListener('DOMContentLoaded', () => {
    const mySea = document.getElementById('my-sea');
    const enemySea = document.getElementById('enemy-sea');
    const startGameButton = document.getElementById('start-game');
    let selectedCells = [];
    let shipSize = 0;
    let shipsPlaced = 0;
    let shipColor = '';
    let gameStarted = false;

    let playerAScore = 0;
    let playerBScore = 0;

    function updateScoreBoard(myScore, enemyScore) {
        const myScoreDisplay = document.getElementById('my-score');
        const enemyScoreDisplay = document.getElementById('enemy-score');
        myScoreDisplay.textContent = myScore;
        enemyScoreDisplay.textContent = enemyScore;
    }

    function setupCellClickHandlers() {
        document.querySelectorAll('#my-sea td').forEach(cell => {
            const rowIndex = cell.parentNode.rowIndex;
            const colIndex = cell.cellIndex;

            // 첫 번째 행과 첫 번째 열의 셀 클릭 불가 처리
            if (rowIndex === 0 || colIndex === 0) return;

            cell.addEventListener('click', () => {
                if (!gameStarted) {
                    handlePlaceShip(cell);
                } else {
                    handleCellClick(cell);
                    checkGameOver();
                }
            });
        });

        document.querySelectorAll('#enemy-sea td:not(.axis)').forEach(cell => {
            cell.addEventListener('click', () => {
                if (gameStarted) handleCellClick(cell);
            });
        });
    }

    setupCellClickHandlers();

    function setShipSize(size, color) {
        if (shipsPlaced < 3) {
            shipSize = size;
            shipColor = color;
        }
    }

    function handlePlaceShip(cell) {
        if (selectedCells.length < shipSize && !cell.classList.contains('selected')) {
            cell.classList.add('selected');
            selectedCells.push(cell);
            cell.style.backgroundColor = shipColor;
            cell.style.border = '2px solid black'; // 수정된 부분
        }

        if (selectedCells.length === shipSize) {
            const isValid = checkShipPlacement(selectedCells);
            if (isValid) {
                selectedCells.forEach(c => c.classList.add('ship'));
                shipsPlaced++;
                shipSize = 0;
                selectedCells = []; // 선택된 셀 초기화
                if (shipsPlaced === 3) {
                    startGameButton.disabled = false; // 게임 시작 버튼 활성화
                } else {
                    alert(`You have placed ${shipsPlaced} ships. Place all 3 ships to start the game.`); // 수정된 부분
                }
            } else {
                alert("Invalid ship placement! Try again.");
                resetSelectedCells();
            }
        }
    }

    // 전투함 크기 설정 버튼 이벤트
    document.getElementById('set-ship-3').addEventListener('click', () => setShipSize(3, 'lightblue'));
    document.getElementById('set-ship-4').addEventListener('click', () => setShipSize(4, 'lightyellow'));
    document.getElementById('set-ship-5').addEventListener('click', () => setShipSize(5, 'lightgreen'));

    // 전투함의 연속성 검사 함수
    function checkShipPlacement(cells) {
        const rows = cells.map(cell => cell.parentNode.rowIndex);
        const cols = cells.map(cell => cell.cellIndex);
        const allInSameRow = rows.every(row => row === rows[0]);
        const allInSameCol = cols.every(col => col === cols[0]);

        if (allInSameRow) {
            cols.sort((a, b) => a - b);
            return cols.every((col, i) => i === 0 || col === cols[i - 1] + 1);
        } else if (allInSameCol) {
            rows.sort((a, b) => a - b);
            return rows.every((row, i) => i === 0 || row === rows[i - 1] + 1);
        }
        return false;
    }

    function resetSelectedCells() {
        selectedCells.forEach(cell => {
            cell.classList.remove('selected');
            cell.style.backgroundColor = '';
            cell.style.border = '';
        });
        selectedCells = []; // Resetting selected cells
    }


    startGameButton.addEventListener('click', () => {
        if (!gameStarted) { // 게임이 시작되지 않은 경우에만
            gameStarted = true;
            startGameButton.disabled = true;
            alert("Game has started!"); // 한 번만 표시
        }
    });

    function handleCellClick(cell) {
            // 게임이 시작되지 않은 경우
    if (!gameStarted) {
        alert("Please start the game first!");
        return; // 게임이 시작되지 않았으면 클릭을 무시
    }

        if (!cell.dataset.state) {
            cell.dataset.state = 'X';
            cell.textContent = 'X';
        } else if (cell.dataset.state === 'X') {
            cell.dataset.state = 'O';
            cell.textContent = 'O';
        } else {
            cell.dataset.state = '';
            cell.textContent = '';
        }
    }


    function checkGameOver() {
        const allShips = document.querySelectorAll('#my-sea .ship');
        const allSunk = Array.from(allShips).every(ship =>
            [...ship.parentNode.cells].filter(c => c.classList.contains('ship'))
                .every(c => c.dataset.state === 'X')
        );

        if (allSunk) {
            gameStarted = false;
            showGameOverButtons();
        }
    }

    function showGameOverButtons() {
            // 이미 버튼이 생성된 경우 추가 생성 방지
    const existingButtonContainer = document.getElementById('button-container');
    if (existingButtonContainer) {
        return; // 버튼이 이미 존재하면 함수를 종료
    }

        const buttonContainer = document.createElement('div');
        const winButton = document.createElement('button');
        const loseButton = document.createElement('button');
    
        winButton.textContent = 'Win';
        loseButton.textContent = 'Lose';
    
        winButton.addEventListener('click', () => {
            playerAScore++;
            updateScoreBoard(playerAScore, playerBScore);
            resetGame();
        });
    
        loseButton.addEventListener('click', () => {
            playerBScore++;
            updateScoreBoard(playerAScore, playerBScore);
            resetGame();
        });
    
        buttonContainer.appendChild(winButton);
        buttonContainer.appendChild(loseButton);
        document.body.appendChild(buttonContainer);
        alert("Game Over!");
    }

    function resetGame() {
        // 'my-sea'에서 첫 번째 행과 열을 제외하고 초기화
        document.querySelectorAll('#my-sea tr').forEach((row, rowIndex) => {
            row.querySelectorAll('td').forEach((cell, colIndex) => {
                if (rowIndex === 0 || colIndex === 0) return; // 첫 번째 행과 열은 초기화하지 않음
                cell.dataset.state = ''; // 셀 상태 초기화
                cell.textContent = ''; // X, O 표시 초기화
                cell.style.backgroundColor = ''; // 배 색상 초기화
                cell.style.border = ''; // 테두리 초기화
                cell.classList.remove('ship', 'selected'); // 배 제거
            });
        });

        // 'enemy-sea'에서 첫 번째 행과 열을 제외하고 초기화
        document.querySelectorAll('#enemy-sea tr').forEach((row, rowIndex) => {
            row.querySelectorAll('td').forEach((cell, colIndex) => {
                if (rowIndex === 0 || colIndex === 0) return; // 첫 번째 행과 열은 초기화하지 않음
                cell.dataset.state = ''; // 상태 초기화
                cell.textContent = ''; // X, O 표시 초기화
                cell.style.backgroundColor = ''; // 색상 초기화
                cell.style.border = ''; // 테두리 초기화
            });
        });

        // 배 크기 및 배치 상태 초기화
        shipSize = 0;
        shipsPlaced = 0;
        gameStarted = false;

        // '게임 시작' 버튼 비활성화 및 배치 모드로 복원
        startGameButton.disabled = true; // 배치 후에만 활성화
        alert("Game has been reset. Place your ships again!");
    }
});


3가지 문제가 남음
시작 누르면 Game has Started! 가 두번 뜸. 
그리고 게임 시작 후 클릭할 때 O가 아니라 X부터 나옴
그리고 게임 리셋하고 다시 게임을 하면 Win Lose버튼이 밑에 또나옴
그리고 게임 리셋했는데 점수판 제외 초기화가 안됨. 