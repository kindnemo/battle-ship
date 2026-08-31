const {GameBoard} = require('../gameboard');

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

    test('receiveAttack records a hit or miss', () => {
        const gameboard = new GameBoard();
        const result = gameboard.receiveAttack(5, 5);
        expect(result).toBe('Hit');
    }) 
});