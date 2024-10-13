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

    function updateScoreBoard(playerA, playerB) {
        const scoreDisplay = document.getElementById('score');
        scoreDisplay.textContent = `${playerA} vs ${playerB}`;
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

    document.getElementById('set-ship-3').addEventListener('click', () => setShipSize(3, 'lightblue'));
    document.getElementById('set-ship-4').addEventListener('click', () => setShipSize(4, 'lightyellow'));
    document.getElementById('set-ship-5').addEventListener('click', () => setShipSize(5, 'lightgreen'));

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
            cell.style.border = `2px solid ${shipColor}`;
        }

        if (selectedCells.length === shipSize) {
            const isValid = checkShipPlacement(selectedCells);
            if (isValid) {
                selectedCells.forEach(c => c.classList.add('ship'));
                shipsPlaced++;
                shipSize = 0;
                if (shipsPlaced === 3) startGameButton.disabled = false;
            } else {
                resetSelectedCells();
            }
            selectedCells = [];
        }
    }

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
    }

    function handleCellClick(cell) {
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

    startGameButton.addEventListener('click', () => {
        gameStarted = true;
        startGameButton.disabled = true;
        alert("Game has started!");
    });

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
    
        // Win/Lose 버튼 활성화 상태 조정
        const buttonContainer = document.querySelector('div'); // 버튼 컨테이너 선택
        if (buttonContainer) {
            // 버튼 비활성화
            buttonContainer.childNodes.forEach(button => {
                if (button.tagName === 'BUTTON') {
                    button.disabled = true; // 모든 버튼 비활성화
                }
            });
        }
    
        // '게임 시작' 버튼 비활성화 및 배치 모드로 복원
        startGameButton.disabled = false; // 게임 시작 버튼 활성화
        alert("Game has been reset. Place your ships again!");
    }
    
    // 게임 오버 버튼 표시 함수
    function showGameOverButtons() {
        const buttonContainer = document.createElement('div'); // 버튼 컨테이너 생성
        const winButton = document.createElement('button');
        const loseButton = document.createElement('button');
    
        winButton.textContent = 'Win';
        loseButton.textContent = 'Lose';
    
        // 버튼 클릭 이벤트 설정
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
        document.body.appendChild(buttonContainer); // 버튼을 문서에 추가
        alert("Game Over! You can choose Win or Lose."); // 게임 오버 메시지
    
        // 버튼 비활성화
        winButton.disabled = false; // 게임 오버 시 Win 버튼 활성화
        loseButton.disabled = false; // 게임 오버 시 Lose 버튼 활성화
    }
    
    
    
});
