const {Ship} = require("../src/shipClass");

describe('Ship functionalities', () => {
    const ship = new Ship();

    test('Check Exists', ()=>{
        expect(ship.length()).toBe(1);
    })
})
