import './style.css';
import { Ship } from './shipClass';
import { HumanPlayer, ComputerPlayer } from './Player';
import { renderBoard, markCell, setStatus, renderDock, setupDropZone } from './domController';

// ─── Ship definitions ─────────────────────────────────────────────────────────
const SHIPS = [
    { name: 'Carrier',     length: 5 },
    { name: 'Battleship',  length: 4 },
    { name: 'Destroyer',   length: 3 },
    { name: 'Submarine',   length: 3 },
    { name: 'Patrol Boat', length: 2 },
];

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const playerBoardEl    = document.getElementById('player-board');
const enemyBoardEl     = document.getElementById('enemy-board');
const startBtn         = document.getElementById('start-btn');
const randomBtn        = document.getElementById('random-btn');
const rotateBtn        = document.getElementById('rotate-btn');
const placementSection = document.getElementById('placement-section');
const enemySection     = document.getElementById('enemy-section');

// ─── Mutable state ────────────────────────────────────────────────────────────
let human, computer, gameOver;
let placedShips    = new Set();
let cleanupDropZone = null;
let dragState       = { name: '', length: 0, direction: 'horizontal' };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isValidPlacement = (board, row, col, length, direction) => {
    for (let i = 0; i < length; i++) {
        const r = direction === 'vertical'   ? row + i : row;
        const c = direction === 'horizontal' ? col + i : col;
        if (r >= 10 || c >= 10 || board[r][c] !== null) return false;
    }
    return true;
};

const randomlyPlaceShips = (player, ships = SHIPS) => {
    ships.forEach(({ name, length }) => {
        let placed = false;
        while (!placed) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            if (!isValidPlacement(player.board.board, row, col, length, direction)) continue;
            player.board.placeShip(new Ship(name, length), row, col, direction);
            placed = true;
        }
    });
};

const setDirection = (dir) => {
    dragState.direction   = dir;
    rotateBtn.textContent = dir === 'horizontal' ? '↻ Horizontal' : '↻ Vertical';
};

const toggleDirection = () => setDirection(
    dragState.direction === 'horizontal' ? 'vertical' : 'horizontal'
);

// ─── Phase 1: Placement ───────────────────────────────────────────────────────
const initPlacement = () => {
    if (cleanupDropZone) { cleanupDropZone(); cleanupDropZone = null; }

    human       = new HumanPlayer('Player');
    placedShips = new Set();
    dragState   = { name: '', length: 0, direction: 'horizontal' };

    renderBoard(playerBoardEl, human.board, true);
    renderDock(SHIPS, placedShips, (name, length) => {
        dragState.name   = name;
        dragState.length = length;
    });

    cleanupDropZone = setupDropZone(
        playerBoardEl,
        human.board,
        () => dragState,
        handleDrop
    );

    startBtn.disabled     = true;
    startBtn.textContent  = 'Start Game';
    rotateBtn.textContent = '↻ Horizontal';
    randomBtn.style.display = '';
    placementSection.classList.remove('hidden');
    enemySection.classList.add('hidden');
    setStatus('Drag ships onto your board. Right-click a ship to rotate.');
};

const handleDrop = (row, col) => {
    const { name, length, direction } = dragState;
    if (!name) return;
    if (!isValidPlacement(human.board.board, row, col, length, direction)) return;

    human.board.placeShip(new Ship(name, length), row, col, direction);
    placedShips.add(name);

    renderBoard(playerBoardEl, human.board, true);
    renderDock(SHIPS, placedShips, (n, l) => {
        dragState.name = n; dragState.length = l;
    });

    if (placedShips.size === SHIPS.length) {
        startBtn.disabled = false;
        setStatus('All ships placed! Click Start Game.');
    } else {
        const remaining = SHIPS.length - placedShips.size;
        setStatus(`${remaining} ship${remaining > 1 ? 's' : ''} left to place.`);
    }
};

// ─── Phase 2: Game ────────────────────────────────────────────────────────────
const startGame = () => {
    if (cleanupDropZone) { cleanupDropZone(); cleanupDropZone = null; }

    computer = new ComputerPlayer();
    gameOver = false;
    randomlyPlaceShips(computer);

    renderBoard(playerBoardEl, human.board, true);
    renderBoard(enemyBoardEl,  computer.board, false, handleHumanAttack);

    placementSection.classList.add('hidden');
    enemySection.classList.remove('hidden');
    startBtn.textContent    = 'Restart';
    startBtn.disabled       = false;
    randomBtn.style.display = 'none';
    setStatus('Your turn — click a cell on the enemy board.');
};

const handleHumanAttack = (row, col) => {
    if (gameOver) return;

    human.attack(computer.board, row, col);
    const wasHit = computer.board.board[row][col] !== null;
    markCell(enemyBoardEl, row, col, wasHit ? 'hit' : 'miss');

    if (computer.board.allSunk()) {
        setStatus('You win! All enemy ships are sunk!');
        gameOver = true;
        return;
    }

    setStatus('Computer is thinking…');
    enemyBoardEl.style.pointerEvents = 'none';

    setTimeout(() => {
        computer.attack(human.board);
        const [cr, cc] = human.board.attackedCells[human.board.attackedCells.length - 1];
        const compHit = human.board.board[cr][cc] !== null;
        markCell(playerBoardEl, cr, cc, compHit ? 'hit' : 'miss');

        if (human.board.allSunk()) {
            setStatus('Computer wins! All your ships are sunk!');
            gameOver = true;
            return;
        }

        setStatus('Your turn — click a cell on the enemy board.');
        enemyBoardEl.style.pointerEvents = '';
    }, 500);
};

// ─── Event listeners ──────────────────────────────────────────────────────────
startBtn.addEventListener('click', () => {
    startBtn.textContent === 'Restart' ? initPlacement() : startGame();
});

randomBtn.addEventListener('click', () => {
    if (cleanupDropZone) { cleanupDropZone(); cleanupDropZone = null; }
    human       = new HumanPlayer('Player');
    placedShips = new Set(SHIPS.map(s => s.name));
    randomlyPlaceShips(human);
    renderBoard(playerBoardEl, human.board, true);
    renderDock(SHIPS, placedShips, () => {});
    startBtn.disabled = false;
    setStatus('Ships randomly placed! Click Start Game when ready.');
});

rotateBtn.addEventListener('click', toggleDirection);

// Right-click on dock ship → rotate
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.dock-ship')) {
        e.preventDefault();
        toggleDirection();
    }
});

// R key → rotate
document.addEventListener('keydown', (e) => {
    if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey) {
        toggleDirection();
    }
});

// Start on load
initPlacement();


