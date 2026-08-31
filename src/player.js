import { GameBoard } from './gameboard.js';
import { Ship} from './ship.js';

export class Player {
    constructor(name, score) {
        this.name = name;
        this.score = score;
        this.gameBoard = new GameBoard();
        this.carrier = new Ship('Carrier', 5);
        this.cruiser = new Ship('Cruiser', 4);
        this.destroyer1 = new Ship('Destroyer', 3);
        this.destroyer2 = new Ship('Destroyer', 3);
        this.submarine = new Ship('Submarine', 2);
    }


    placeShip(ship, x, y, orientation) {
        // Implementing ship placement logic based on orientation and coordinates
        
        // Checking if the ship is out of bounds
        if (orientation === 'horizontal') {
            if (x + ship.length > 10) {
                return 'Ship placement is out of bounds';
            }
        } else if (orientation === 'vertical') {
            if (y + ship.length > 10) {
                return 'Ship placement is out of bounds';
            }
        }

        // Placing ships vertically or horizontally based on the orientation
        if (orientation === 'horizontal') {
            for (let i =0; i< ship.length; i++) {
                this.gameBoard.coordinates[x + i][y].ship = ship;
            }
        }
    }
}