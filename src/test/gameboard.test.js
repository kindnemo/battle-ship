const {GameBoard} = require('../gameboard');
const {Ship} = require('../ship');

describe('Gameboard', () => {
    test('Creates a gameboard with a 10x10 grid and no ships', () =>{
        const gameboard = new GameBoard();
        expect(gameboard.ships).toEqual([]);
        expect(gameboard.hits).toEqual([]);
        expect(gameboard.misses).toEqual([]);
    })

    test('Initializes with empty hits and misses arrays', () => {
        const gameboard = new GameBoard();
        expect(gameboard.hits).toEqual([]);
        expect(gameboard.misses).toEqual([]);
    });

    test('receiveAttack records a miss when attacking an empty position', () => {
        const gameboard = new GameBoard();
        const result = gameboard.receiveAttack(5, 5);
        expect(result).toBe('Miss');
        expect(gameboard.misses).toEqual([{ x: 5, y: 5 }]);
    });

    test('receiveAttack records a hit and damages the ship', () => {
        const gameboard = new GameBoard();
        const destroyer = new Ship('Destroyer', 3);

        gameboard.placeShip(destroyer, 0, 0, 'horizontal');
        const result = gameboard.receiveAttack(1, 0);

        expect(result).toBe('Hit');
        expect(gameboard.hits).toEqual([{ x: 1, y: 0 }]);
        expect(destroyer.hits).toBe(1);
    });

    test('does not place a ship when it partially overlaps another ship', () => {
        const gameboard = new GameBoard();
        const carrier = new Ship('Carrier', 5);
        const cruiser = new Ship('Cruiser', 4);

        gameboard.placeShip(carrier, 0, 0, 'horizontal');
        const result = gameboard.placeShip(cruiser, 3, 0, 'horizontal');

        expect(result).toBe('A ship is already placed at these coordinates');
        expect(gameboard.ships).toEqual([carrier]);
    });

    test('does not place a ship when it crosses another ship vertically', () => {
        const gameboard = new GameBoard();
        const carrier = new Ship('Carrier', 5);
        const submarine = new Ship('Submarine', 2);

        gameboard.placeShip(carrier, 0, 0, 'horizontal');
        const result = gameboard.placeShip(submarine, 2, 0, 'vertical');

        expect(result).toBe('A ship is already placed at these coordinates');
        expect(gameboard.coordinates[2][1].ship).toBeUndefined();
    });

    test('allShipsSunk returns false while any placed ship is still afloat', () => {
        const gameboard = new GameBoard();
        const submarine = new Ship('Submarine', 2);

        gameboard.placeShip(submarine, 0, 0, 'vertical');
        gameboard.receiveAttack(0, 0);

        expect(gameboard.allShipsSunk()).toBe(false);
    });

    test('allShipsSunk returns true after every placed ship is sunk', () => {
        const gameboard = new GameBoard();
        const submarine = new Ship('Submarine', 2);
        const destroyer = new Ship('Destroyer', 3);

        gameboard.placeShip(submarine, 0, 0, 'vertical');
        gameboard.placeShip(destroyer, 2, 0, 'horizontal');

        gameboard.receiveAttack(0, 0);
        gameboard.receiveAttack(0, 1);
        gameboard.receiveAttack(2, 0);
        gameboard.receiveAttack(3, 0);
        gameboard.receiveAttack(4, 0);

        expect(gameboard.allShipsSunk()).toBe(true);
    });
});
