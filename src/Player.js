const { GameBoard } = require('./gameBoard');

class Player {
    constructor(name) {
        this.name = name;
        this.board = new GameBoard();
        this.availableMoves = [];
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                this.availableMoves.push([row, col]);
            }
        }
    }
}

class HumanPlayer extends Player {
    constructor(name) {
        super(name);
    }

    attack(enemyBoard, row, col) {
        enemyBoard.receiveAttack(row, col);
        this.availableMoves = this.availableMoves.filter(
            ([r, c]) => !(r === row && c === col)
        );
    }
}

class ComputerPlayer extends Player {
    constructor() {
        super('Computer');
    }

    attack(enemyBoard) {
        const index = Math.floor(Math.random() * this.availableMoves.length);
        const [row, col] = this.availableMoves[index];
        this.availableMoves.splice(index, 1);
        enemyBoard.receiveAttack(row, col);
    }
}

module.exports = { Player, HumanPlayer, ComputerPlayer };