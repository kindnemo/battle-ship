import { ShipPlacement } from './shipPlacement.js';

export class GameBoard {
    constructor() {
        this.ships = [];
        this.hits = [];
        this.misses = [];
        this.coordinates = Array.from({ length: 10 }, (_, x) =>
            Array.from({ length: 10 }, (_, y) => ({ x, y }))
        );
        this.shipPlacement = new ShipPlacement(this);
    }


    placeShip(ship, x, y, orientation) {
        return this.shipPlacement.place(ship, x, y, orientation);
    }

    receiveAttack(x, y) {
        if (this.hits.some(hit => hit.x === x && hit.y === y) || this.misses.some(miss => miss.x === x && miss.y === y)) {
            return 'Already attacked this position';
        }

        if (this.coordinates[x][y].ship) {
            this.hits.push({ x, y });
            this.coordinates[x][y].ship.hit();
            return 'Hit';
        }

        return this.missedAttack(x, y);
    }

    missedAttack(x, y) {
        this.misses.push({ x, y });
        return 'Miss';
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }

    checkShipCoords(ship, x,y, orientation) {
        return this.shipPlacement.getCoordinates(ship, x, y, orientation);
    }
}
