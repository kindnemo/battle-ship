export class ShipPlacement {
    constructor(board) {
        this.board = board;
    }

    place(ship, x, y, orientation) {
        if (!this.isValidOrientation(orientation)) {
            return 'Invalid orientation';
        }

        if (this.isOutOfBounds(ship, x, y, orientation)) {
            return 'Ship placement is out of bounds';
        }

        const shipCoords = this.getCoordinates(ship, x, y, orientation);

        if (this.hasOverlap(shipCoords)) {
            return 'A ship is already placed at these coordinates';
        }

        shipCoords.forEach(coord => {
            this.board.coordinates[coord.x][coord.y].ship = ship;
        });

        this.board.ships.push(ship);
        return 'Ship placed';
    }

    getCoordinates(ship, x, y, orientation) {
        const coords = [];

        for (let i = 0; i < ship.length; i++) {
            if (orientation === 'horizontal') {
                coords.push({ x: x + i, y });
            } else {
                coords.push({ x, y: y + i });
            }
        }

        return coords;
    }

    isValidOrientation(orientation) {
        return orientation === 'horizontal' || orientation === 'vertical';
    }

    isOutOfBounds(ship, x, y, orientation) {
        if (orientation === 'horizontal') {
            return x + ship.length > 10;
        }

        return y + ship.length > 10;
    }

    hasOverlap(coords) {
        return coords.some(coord => this.board.coordinates[coord.x][coord.y].ship);
    }
}
