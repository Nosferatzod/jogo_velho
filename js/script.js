document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const newGameButton = document.getElementById('new');
    const gameModeSelect = document.getElementById('game-mode');

    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let vsAI = false; // Define o modo de jogo contra a máquina

    let xWins = 0;
    let oWins = 0;
    let draws = 0;

    const xWinsElem = document.getElementById('x-wins');
    const oWinsElem = document.getElementById('o-wins');
    const drawsElem = document.getElementById('draws');

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    gameModeSelect.addEventListener('change', () => {
        vsAI = gameModeSelect.value === 'ai';
        resetGame();
    });

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add('clicked');

        checkForWin();
        checkForDraw();

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (vsAI && gameActive && currentPlayer === 'O') {
            aiMove();
        } else {
            status.textContent = `É a vez do Jogador ${currentPlayer}`;
        }
    }

    function aiMove() {
        // IA faz sua jogada
        const bestMove = minimax(gameState, 'O').index;
        gameState[bestMove] = 'O';
        cells[bestMove].textContent = 'O';
        cells[bestMove].classList.add('clicked');

        checkForWin();
        checkForDraw();

        currentPlayer = 'X';
        status.textContent = `É a vez do Jogador ${currentPlayer}`;
    }

    function minimax(newGameState, player) {
        const availableSpots = newGameState.map((cell, index) => cell === '' ? index : null).filter(item => item !== null);

        if (checkWinner(newGameState, 'O')) {
            return { score: 10 };
        } else if (checkWinner(newGameState, 'X')) {
            return { score: -10 };
        } else if (availableSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availableSpots.length; i++) {
            const move = {};
            move.index = availableSpots[i];
            newGameState[availableSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newGameState, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newGameState, 'O');
                move.score = result.score;
            }

            newGameState[availableSpots[i]] = '';
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

    function checkWinner(state, player) {
        return winningConditions.some(condition => {
            return condition.every(index => state[index] === player);
        });
    }

    function checkForWin() {
        if (checkWinner(gameState, 'X')) {
            gameActive = false;
            status.textContent = 'Jogador X ganhou!';
            xWins++;
            xWinsElem.textContent = xWins;
        } else if (checkWinner(gameState, 'O')) {
            gameActive = false;
            status.textContent = 'Jogador O ganhou!';
            oWins++;
            oWinsElem.textContent = oWins;
        }
    }

    function checkForDraw() {
        if (!gameState.includes('') && gameActive) {
            gameActive = false;
            status.textContent = 'É um empate!';
            draws++;
            drawsElem.textContent = draws;
        }
    }

    function resetGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = `É a vez do Jogador ${currentPlayer}`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('clicked');
        });
    }

    function newGame() {
        resetGame();
        xWins = 0;
        oWins = 0;
        draws = 0;
        xWinsElem.textContent = xWins;
        oWinsElem.textContent = oWins;
        drawsElem.textContent = draws;
    }

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);
    newGameButton.addEventListener('click', newGame);
});