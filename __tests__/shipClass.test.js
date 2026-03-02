const { Ship } = require("../src/shipClass");

describe('Ship', () => {
    test('has correct length', () => {
        const ship = new Ship('Destroyer', 3);
        expect(ship.length).toBe(3);
    });

    test('starts with zero hits', () => {
        const ship = new Ship('Destroyer', 3);
        expect(ship.hits).toBe(0);
    });

    test('hit() increases hit count', () => {
        const ship = new Ship('Destroyer', 3);
        ship.hit();
        ship.hit();
        expect(ship.hits).toBe(2);
    });

    test('isSunk() returns false when not fully hit', () => {
        const ship = new Ship('Destroyer', 3);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });

    test('isSunk() returns true when hits equal length', () => {
        const ship = new Ship('Destroyer', 3);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
});
