import { Player } from './player.js';

export class PvPGame {
    constructor(playerOneName = 'Player 1', playerTwoName = 'Computer', mode = 'pvc') {
        this.mode = mode;
        const isPvC = mode === 'pvc';

        this.players = [
            new Player(playerOneName, 0, false),
            new Player(playerTwoName, 0, isPvC),
        ];
        this.currentPlayerIndex = 0;
        this.placementPlayerIndex = 0;
        this.selectedOrientation = 'horizontal';
        this.phase = 'placement';
        this.winner = null;
    }

    get currentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    get opponent() {
        return this.players[this.getOpponentIndex()];
    }

    get placementPlayer() {
        return this.players[this.placementPlayerIndex];
    }

    get shipToPlace() {
        return this.placementPlayer.getFleet()[this.placementPlayer.gameBoard.ships.length];
    }

    setOrientation(orientation) {
        if (orientation !== 'horizontal' && orientation !== 'vertical') {
            return 'Invalid orientation';
        }

        this.selectedOrientation = orientation;
        return 'Orientation changed';
    }

    placeCurrentShip(x, y) {
        if (this.phase !== 'placement') {
            return 'Placement phase is over';
        }

        const ship = this.shipToPlace;

        if (!ship) {
            return 'All ships already placed';
        }

        const result = this.placementPlayer.gameBoard.placeShip(ship, x, y, this.selectedOrientation);

        if (result !== 'Ship placed') {
            return result;
        }

        if (this.placementPlayer.gameBoard.ships.length === this.placementPlayer.getFleet().length) {
            this.advancePlacement();
        }

        return result;
    }

    // Places every ship in a player's fleet on random, valid coordinates.
    // Used for the computer's fleet so it never needs manual placement.
    autoPlaceFleet(player) {
        player.getFleet().forEach(ship => {
            let placed = false;

            while (!placed) {
                const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);

                placed = player.gameBoard.placeShip(ship, x, y, orientation) === 'Ship placed';
            }
        });
    }

    // Picks a random coordinate on the given board that hasn't been
    // attacked yet (no existing hit or miss there).
    getRandomUnattackedCoordinate(board) {
        let x;
        let y;

        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        } while (
            board.hits.some(hit => hit.x === x && hit.y === y) ||
            board.misses.some(miss => miss.x === x && miss.y === y)
        );

        return { x, y };
    }

    // Called by the UI once it's the computer's turn to attack.
    // Returns the same kind of result string as attack(), or null
    // if it isn't actually the computer's turn to move.
    takeComputerTurn() {
        if (this.phase !== 'battle' || this.winner) {
            return null;
        }

        if (!this.currentPlayer.isComputer) {
            return null;
        }

        const { x, y } = this.getRandomUnattackedCoordinate(this.opponent.gameBoard);
        return this.attack(x, y);
    }

    attack(x, y) {
        if (this.winner) {
            return 'Game over';
        }

        if (this.phase !== 'battle') {
            return 'Place all ships before attacking';
        }

        const result = this.currentPlayer.attack(this.opponent, x, y);

        if (result === 'Already attacked this position') {
            return result;
        }

        if (this.opponent.gameBoard.allShipsSunk()) {
            this.winner = this.currentPlayer;
            this.phase = 'finished';
            return `${result} - ${this.currentPlayer.name} wins`;
        }

        this.switchTurn();
        return result;
    }

    getOpponentIndex() {
        return this.currentPlayerIndex === 0 ? 1 : 0;
    }

    switchTurn() {
        this.currentPlayerIndex = this.getOpponentIndex();
    }

    advancePlacement() {
        if (this.placementPlayerIndex === 0) {
            this.placementPlayerIndex = 1;

            // The computer never uses the placement UI — its fleet is
            // placed automatically the moment it becomes its "turn" to place.
            if (this.placementPlayer.isComputer) {
                this.autoPlaceFleet(this.placementPlayer);
                this.phase = 'battle';
                this.currentPlayerIndex = 0;
            }

            return;
        }

        this.phase = 'battle';
        this.currentPlayerIndex = 0;
    }
}