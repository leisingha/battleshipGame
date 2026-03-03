const { GameBoard } = require('../src/gameBoard');
const { Ship } = require('../src/shipClass');

describe('GameBoard', () => {
    test('board initializes as 10x10 grid of nulls', () => {
        const gBoard = new GameBoard();
        expect(gBoard.board.length).toBe(10);
        expect(gBoard.board[0].length).toBe(10);
        expect(gBoard.board[0][0]).toBeNull();
    });

    test('placeShip places ship horizontally across correct cells', () => {
        const gBoard = new GameBoard();
        const ship = new Ship('Destroyer', 3);
        gBoard.placeShip(ship, 1, 1, 'horizontal');
        expect(gBoard.board[1][1]).toBe(ship);
        expect(gBoard.board[1][2]).toBe(ship);
        expect(gBoard.board[1][3]).toBe(ship);
    });

    test('placeShip places ship vertically across correct cells', () => {
        const gBoard = new GameBoard();
        const ship = new Ship('Carrier', 3);
        gBoard.placeShip(ship, 2, 4, 'vertical');
        expect(gBoard.board[2][4]).toBe(ship);
        expect(gBoard.board[3][4]).toBe(ship);
        expect(gBoard.board[4][4]).toBe(ship);
    });

    test('receiveAttack hits a ship on that cell', () => {
        const gBoard = new GameBoard();
        const ship = new Ship('Submarine', 2);
        gBoard.placeShip(ship, 0, 0, 'horizontal');
        gBoard.receiveAttack(0, 0);
        expect(ship.hits).toBe(1);
    });

    test('receiveAttack records a miss when no ship is present', () => {
        const gBoard = new GameBoard();
        gBoard.receiveAttack(5, 5);
        expect(gBoard.missedAttacks).toContainEqual([5, 5]);
    });

    test('allSunk() returns false when ships remain afloat', () => {
        const gBoard = new GameBoard();
        const ship = new Ship('Destroyer', 2);
        gBoard.placeShip(ship, 0, 0, 'horizontal');
        gBoard.receiveAttack(0, 0);
        expect(gBoard.allSunk()).toBe(false);
    });

    test('allSunk() returns true when all ships are sunk', () => {
        const gBoard = new GameBoard();
        const ship = new Ship('Destroyer', 2);
        gBoard.placeShip(ship, 0, 0, 'horizontal');
        gBoard.receiveAttack(0, 0);
        gBoard.receiveAttack(0, 1);
        expect(gBoard.allSunk()).toBe(true);
    });
});