import './style.css';
import { Ship } from './shipClass';
import { HumanPlayer, ComputerPlayer } from './Player';
import { renderBoard, markCell, setStatus } from './domController';

// ─── Ship definitions ────────────────────────────────────────────────────────
const SHIPS = [
    { name: 'Carrier',    length: 5 },
    { name: 'Battleship', length: 4 },
    { name: 'Destroyer',  length: 3 },
    { name: 'Submarine',  length: 3 },
    { name: 'Patrol Boat',length: 2 },
];

// ─── Random ship placement ────────────────────────────────────────────────────
const randomlyPlaceShips = (player) => {
    SHIPS.forEach(({ name, length }) => {
        let placed = false;
        while (!placed) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);

            // Check bounds
            if (direction === 'horizontal' && col + length > 10) continue;
            if (direction === 'vertical'   && row + length > 10) continue;

            // Check for overlap
            let overlap = false;
            for (let i = 0; i < length; i++) {
                const r = direction === 'vertical'   ? row + i : row;
                const c = direction === 'horizontal' ? col + i : col;
                if (player.board.board[r][c] !== null) { overlap = true; break; }
            }
            if (overlap) continue;

            player.board.placeShip(new Ship(name, length), row, col, direction);
            placed = true;
        }
    });
};

// ─── Game setup ───────────────────────────────────────────────────────────────
let human, computer, gameOver;

const playerBoardEl = document.getElementById('player-board');
const enemyBoardEl  = document.getElementById('enemy-board');
const startBtn      = document.getElementById('start-btn');

const startGame = () => {
    human    = new HumanPlayer('Player');
    computer = new ComputerPlayer();
    gameOver = false;

    randomlyPlaceShips(human);
    randomlyPlaceShips(computer);

    renderBoard(playerBoardEl, human.board, true);           // show own ships
    renderBoard(enemyBoardEl,  computer.board, false, handleHumanAttack);

    setStatus("Your turn — click a cell on the enemy board.");
    startBtn.textContent = 'Restart';
};

// ─── Game loop ────────────────────────────────────────────────────────────────
const handleHumanAttack = (row, col) => {
    if (gameOver) return;

    // Human attacks
    human.attack(computer.board, row, col);
    const humanResult = computer.board.board[row][col] ? 'hit' : 'miss';
    markCell(enemyBoardEl, row, col, humanResult);

    if (computer.board.allSunk()) {
        setStatus('You win! All enemy ships are sunk!');
        gameOver = true;
        return;
    }

    // Block further clicks while computer is "thinking"
    setStatus("Computer is thinking…");
    enemyBoardEl.style.pointerEvents = 'none';

    setTimeout(() => {
        // Computer attacks
        const movesBefore = computer.availableMoves.length + 1;
        computer.attack(human.board);

        // Find what coordinate the computer attacked
        const attacked = human.board.attackedCells[human.board.attackedCells.length - 1];
        const [cr, cc] = attacked;
        const computerResult = human.board.board[cr][cc] ? 'hit' : 'miss';
        markCell(playerBoardEl, cr, cc, computerResult);

        if (human.board.allSunk()) {
            setStatus('Computer wins! All your ships are sunk!');
            gameOver = true;
            return;
        }

        setStatus("Your turn — click a cell on the enemy board.");
        enemyBoardEl.style.pointerEvents = '';
    }, 500);
};

// ─── Event listeners ──────────────────────────────────────────────────────────
startBtn.addEventListener('click', startGame);

// Start immediately on load
startGame();


