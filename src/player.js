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

    attack(opponent, x, y) {
        const opp = opponent.gameBoard;
        return opp.receiveAttack(x, y);
    }
}