export class GameBoard {
    constructor() {
        this.ships = [];
        this.hits = [];
        this.misses = [];
        this.coordinates = Array.from({ length: 10 }, (_, x) =>
            Array.from({ length: 10 }, (_, y) => ({ x, y }))
        );
    }

    receiveAttack(x, y) {
        if (this.hits.some(hit => hit.x === x && hit.y === y) || this.misses.some(miss => miss.x === x && miss.y === y)) {
            return 'Already attacked this position';
        }
        this.hits.push({ x, y });
        return 'Hit';
    }

    missedAttack(x, y) {
        this.misses.push({ x, y });
        return 'Miss';
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}
