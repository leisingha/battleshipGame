class GameBoard {
    constructor() {
        this.board = Array(10).fill(null).map(() => Array(10).fill(null));
        this.missedAttacks = [];
        this.ships = [];
    }

    placeShip(ship, row, col, direction) {
        for (let i = 0; i < ship.length; i++) {
            if (direction === 'horizontal') {
                this.board[row][col + i] = ship;
            } else {
                this.board[row + i][col] = ship;
            }
        }
        this.ships.push(ship);
    }

    receiveAttack(row, col) {
        const target = this.board[row][col];
        if (target) {
            target.hit();
        } else {
            this.missedAttacks.push([row, col]);
        }
    }

    allSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}

module.exports = { GameBoard };