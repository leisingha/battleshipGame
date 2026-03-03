// domController.js — handles all DOM rendering and interaction.
// No game logic lives here. It only reads state and emits events.

// Renders the full 10x10 board.
// showShips: true for player's own board, false for enemy board.
// onCellClick: callback(row, col) — only attached on enemy board cells.
const renderBoard = (boardElement, gameBoard, showShips = false, onCellClick = null) => {
    boardElement.innerHTML = '';

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            const hasShip = gameBoard.board[row][col] !== null;
            const wasAttacked = gameBoard.attackedCells.some(
                ([r, c]) => r === row && c === col
            );

            if (wasAttacked) {
                cell.classList.add(hasShip ? 'hit' : 'miss');
            } else {
                if (showShips && hasShip) cell.classList.add('ship');
                if (onCellClick) {
                    cell.addEventListener('click', () => onCellClick(row, col));
                }
            }

            boardElement.appendChild(cell);
        }
    }
};

// Updates a single cell after an attack (avoids full re-render).
const markCell = (boardElement, row, col, result) => {
    const cell = boardElement.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
    );
    if (cell) {
        cell.classList.remove('ship');
        cell.classList.add(result); // 'hit' or 'miss'
    }
};

const setStatus = (message) => {
    const el = document.getElementById('status-message');
    if (el) el.textContent = message;
};

export { renderBoard, markCell, setStatus };

