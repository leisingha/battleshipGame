// domController.js — handles all DOM rendering and interaction.
// No game logic lives here. It only reads state and emits events.

// ─── Board rendering ──────────────────────────────────────────────────────────

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

// ─── Placement: ship dock ─────────────────────────────────────────────────────

// Renders remaining ships in the dock.
// onDragStart(name, length) is called when a ship starts being dragged.
const renderDock = (ships, placedNames, onDragStart) => {
    const dock = document.getElementById('dock-ships');
    if (!dock) return;
    dock.innerHTML = '';

    ships.forEach(({ name, length }) => {
        if (placedNames.has(name)) return;

        const shipEl = document.createElement('div');
        shipEl.classList.add('dock-ship');
        shipEl.draggable = true;
        shipEl.dataset.name = name;
        shipEl.dataset.length = length;

        const visual = document.createElement('div');
        visual.classList.add('dock-ship-visual');
        for (let i = 0; i < length; i++) {
            const seg = document.createElement('div');
            seg.classList.add('dock-cell');
            visual.appendChild(seg);
        }

        const label = document.createElement('span');
        label.classList.add('dock-label');
        label.textContent = name;

        shipEl.appendChild(visual);
        shipEl.appendChild(label);
        dock.appendChild(shipEl);

        shipEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            onDragStart(name, length);
            // Defer so the browser can snapshot the element before we style it
            setTimeout(() => shipEl.classList.add('dragging'), 0);
        });

        shipEl.addEventListener('dragend', () => {
            shipEl.classList.remove('dragging');
        });
    });
};

// ─── Placement: drag-over preview & drop zone ─────────────────────────────────

const _clearHighlights = (boardEl) => {
    boardEl.querySelectorAll('.preview-valid, .preview-invalid').forEach(cell => {
        cell.classList.remove('preview-valid', 'preview-invalid');
    });
};

const _highlightPreview = (boardEl, row, col, length, direction, gameBoard) => {
    let valid = true;
    const coords = [];

    for (let i = 0; i < length; i++) {
        const r = direction === 'vertical'   ? row + i : row;
        const c = direction === 'horizontal' ? col + i : col;
        if (r >= 10 || c >= 10 || gameBoard.board[r][c] !== null) valid = false;
        coords.push([r, c]);
    }

    coords.forEach(([r, c]) => {
        if (r < 10 && c < 10) {
            const cell = boardEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            if (cell) cell.classList.add(valid ? 'preview-valid' : 'preview-invalid');
        }
    });
};

// Attaches dragover/dragleave/drop to the board element.
// getDragState() → { name, length, direction }
// onDrop(row, col) is called when a ship is dropped.
// Returns a cleanup function — call it before re-initialising placement.
const setupDropZone = (boardEl, gameBoard, getDragState, onDrop) => {
    const controller = new AbortController();
    const { signal } = controller;

    boardEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        const cell = e.target.closest('.cell');
        if (!cell) return;
        const { length, direction } = getDragState();
        _clearHighlights(boardEl);
        _highlightPreview(boardEl, +cell.dataset.row, +cell.dataset.col, length, direction, gameBoard);
    }, { signal });

    boardEl.addEventListener('dragleave', (e) => {
        if (!boardEl.contains(e.relatedTarget)) {
            _clearHighlights(boardEl);
        }
    }, { signal });

    boardEl.addEventListener('drop', (e) => {
        e.preventDefault();
        _clearHighlights(boardEl);
        const cell = e.target.closest('.cell');
        if (!cell) return;
        onDrop(+cell.dataset.row, +cell.dataset.col);
    }, { signal });

    return () => controller.abort();
};

export { renderBoard, markCell, setStatus, renderDock, setupDropZone };
