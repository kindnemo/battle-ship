import { GameBoard } from './gameboard.js';
import { Ship} from './ship.js';

export class Player {
    constructor(name, score, isComputer = false) {
        this.name = name;
        this.score = score;
        this.isComputer = isComputer;
        this.gameBoard = new GameBoard();
        this.carrier = new Ship('Carrier', 5);
        this.cruiser = new Ship('Cruiser', 4);
        this.destroyer1 = new Ship('Destroyer', 3);
        this.destroyer2 = new Ship('Destroyer', 3);
        this.submarine = new Ship('Submarine', 2);
    }

    getFleet() {
        return [
            this.carrier,
            this.cruiser,
            this.destroyer1,
            this.destroyer2,
            this.submarine,
        ];
    }

    attack(opponent, x, y) {
        const opp = opponent.gameBoard;
        return opp.receiveAttack(x, y);
    }
}
