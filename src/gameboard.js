export class GameBoard {
    constructor() {
        this.ships = [];
        this.hits = [];
        this.misses = [];
        this.coordinates = Array.from({ length: 10 }, (_, x) =>
            Array.from({ length: 10 }, (_, y) => ({ x, y }))
        );
    }


    placeShip(ship, x, y, orientation) {
        if (orientation === 'horizontal') {
            if (x + ship.length > 10) {
                return 'Ship placement is out of bounds';
            }
        } else if (orientation === 'vertical') {
            if (y + ship.length > 10) {
                return 'Ship placement is out of bounds';
            }
        } else {
            return 'Invalid orientation';
        }

        const shipCoords = this.checkShipCoords(ship, x, y, orientation);

        if (shipCoords.some(coord => this.coordinates[coord.x][coord.y].ship)) {
            return 'A ship is already placed at these coordinates';
        }

        shipCoords.forEach(coord => {
            this.coordinates[coord.x][coord.y].ship = ship;
        });

        this.ships.push(ship);
        return 'Ship placed';
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
        // Implementation for checking ship placement
        const coords = [];
        if (orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                coords.push({ x: x + i, y: y });
            }
        }else{
            for (let i = 0; i < ship.length; i++) {
                coords.push({ x: x, y: y + i });
            }
        }
        return coords;
    }
}
