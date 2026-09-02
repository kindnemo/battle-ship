import {Player} from '../player.js';

describe('Player', () =>{
    test('should create a player with a name and score', () => {
        const player1 = new Player('Player 1', 0);
        expect(player1.name).toBe('Player 1');
        expect(player1.score).toBe(0);
    });
    test('should place a ship on the game board', () => {
        const player1 = new Player('Player 1', 0);
        player1.placeShip(player1.carrier, 0, 0, 'horizontal');
        for (let i = 0; i < player1.carrier.length; i++) {
            expect(player1.gameBoard.coordinates[i][0].ship).toBe(player1.carrier);
        }
    });

    // Testing ship placement out of bounds
    test('should not place a ship out of bounds', () => {
        const player1 = new Player('Player 1', 0);
        const result = player1.placeShip(player1.carrier, 8, 0, 'horizontal');
        expect(result).toBe('Ship placement is out of bounds');
    });

    // Testing attacking a ship and seeing if it hits
    test('should record a hit when attacking a ship', () => {
        const player1 = new Player('Player 1', 0);
        player1.placeShip(player1.carrier, 0, 0, 'horizontal');
        const result = player1.gameBoard.receiveAttack(0, 0);
        expect(result).toBe('Hit');
    })

    // Testing ship coordinates placement
    test('should return the coordinates of the ship', () => {
        const player1 = new Player('Player 1', 0);
        player1.placeShip(player1.submarine, 0, 0, 'vertical');
        const coords = player1.gameBoard.checkShipCoords(player1.submarine, 0, 0, 'vertical');
        player1.placeShip(player1.carrier, 2, 1, 'horizontal');
        const coords2 = player1.gameBoard.checkShipCoords(player1.carrier, 2, 1, 'horizontal');
        expect(coords).toEqual([{ x: 0, y: 0 }, { x: 0, y: 1 }]);
        expect(coords2).toEqual([{ x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }]);
    })

    // Testing attacking a ship and seeing if it is sunk
    test('Should record a sink when attacking the entire length of a ship', () => {
        const player1 = new Player('Player 1', 0 );
        player1.placeShip(player1.carrier, 0, 0, 'horizontal');
        for (let i = 0; i < player1.carrier.length; i++){
            player1.gameBoard.receiveAttack(i, 0);
        }
        expect(player1.carrier.isSunk()).toBe(true);
    });
});