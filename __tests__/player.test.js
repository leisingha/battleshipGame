const { HumanPlayer, ComputerPlayer } = require('../src/Player');
const { GameBoard } = require('../src/gameBoard');
const { Ship } = require('../src/shipClass');

describe('Player', () => {
    test('starts with 100 available moves', () => {
        const human = new HumanPlayer('Alice');
        expect(human.availableMoves.length).toBe(100);
    });

    test('has their own GameBoard', () => {
        const human = new HumanPlayer('Alice');
        expect(human.board).toBeInstanceOf(GameBoard);
    });
});

describe('HumanPlayer', () => {
    test('attack calls receiveAttack on the enemy board', () => {
        const human = new HumanPlayer('Alice');
        const enemyBoard = new GameBoard();
        human.attack(enemyBoard, 3, 4);
        expect(enemyBoard.missedAttacks).toContainEqual([3, 4]);
    });

    test('attack removes the coordinate from availableMoves', () => {
        const human = new HumanPlayer('Alice');
        const enemyBoard = new GameBoard();
        human.attack(enemyBoard, 0, 0);
        const stillAvailable = human.availableMoves.some(
            ([r, c]) => r === 0 && c === 0
        );
        expect(stillAvailable).toBe(false);
        expect(human.availableMoves.length).toBe(99);
    });
});

describe('ComputerPlayer', () => {
    test('is named Computer', () => {
        const computer = new ComputerPlayer();
        expect(computer.name).toBe('Computer');
    });

    test('attack reduces availableMoves by 1', () => {
        const computer = new ComputerPlayer();
        const enemyBoard = new GameBoard();
        computer.attack(enemyBoard);
        expect(computer.availableMoves.length).toBe(99);
    });

    test('never attacks the same square twice', () => {
        const computer = new ComputerPlayer();
        const enemyBoard = new GameBoard();
        const attacked = new Set();
        for (let i = 0; i < 100; i++) {
            const before = computer.availableMoves.length;
            computer.attack(enemyBoard);
            // find the attacked cell by checking missedAttacks (board is empty)
            const latest = enemyBoard.missedAttacks[enemyBoard.missedAttacks.length - 1];
            const key = `${latest[0]},${latest[1]}`;
            expect(attacked.has(key)).toBe(false);
            attacked.add(key);
        }
        expect(computer.availableMoves.length).toBe(0);
    });
});
