import { PvPGame } from './game.js';

const COMPUTER_MOVE_DELAY_MS = 600;

export class GameUI {
    constructor() {
        this.game = new PvPGame();
        this.boardElements = [
            document.querySelector('#gameboard-1'),
            document.querySelector('#gameboard-2'),
        ];

        this.boardLabels = this.boardElements.map(el =>
            el.closest('.gameboard-subcontainer').querySelector('.fleet-info')
        );

        this.boardViews = this.boardElements.map(el =>
            el.closest('.gameboard-subcontainer').querySelector('.view')
        );

        this.fleetStatusElement = document.querySelector('#fleet-status');
        this.moveIndicator = document.querySelector('#move-indicator');
        this.controls = this.createControls();
    }

    init() {
        this.boardElements[0].addEventListener('click', event => this.handleBoardClick(0, event));
        this.boardElements[1].addEventListener('click', event => this.handleBoardClick(1, event));
        this.render();
    }

    createControls() {
        const controls = document.createElement('div');
        controls.classList.add('game-controls');

        const horizontalButton = document.createElement('button');
        horizontalButton.type = 'button';
        horizontalButton.textContent = 'Horizontal';
        horizontalButton.dataset.orientation = 'horizontal';

        const verticalButton = document.createElement('button');
        verticalButton.type = 'button';
        verticalButton.textContent = 'Vertical';
        verticalButton.dataset.orientation = 'vertical';

        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.textContent = 'New Game';
        resetButton.classList.add('secondary');

        horizontalButton.addEventListener('click', () => this.setOrientation('horizontal'));
        verticalButton.addEventListener('click', () => this.setOrientation('vertical'));
        resetButton.addEventListener('click', () => this.reset());

        controls.append(horizontalButton, verticalButton, resetButton);
        document.querySelector('#main').prepend(controls);

        return controls;
    }

    setOrientation(orientation) {
        const result = this.game.setOrientation(orientation);
        this.moveIndicator.textContent = result;
        this.render();
    }

    reset() {
        this.game = new PvPGame();
        this.moveIndicator.textContent = '';
        this.render();
    }

    // True while it's the computer's move to make (placement is instant,
    // so this really only matters mid-battle, but it's a safe guard either way).
    isComputersTurn() {
        const actor = this.game.phase === 'placement' ? this.game.placementPlayer : this.game.currentPlayer;
        return Boolean(actor && actor.isComputer);
    }

    handleBoardClick(boardIndex, event) {
        if (this.isComputersTurn()) return;
        if (!event.target.classList.contains('cell')) return;

        if (this.game.phase === 'placement') {
            this.handlePlacementClick(boardIndex, event.target);
            return;
        }

        if (this.game.phase === 'battle') {
            this.handleAttackClick(boardIndex, event.target);
        }
    }

    handlePlacementClick(boardIndex, cellElement) {
        // You can only place ships on your own board.
        if (boardIndex !== this.game.placementPlayerIndex) return;

        const { x, y } = this.getCellCoords(cellElement);
        const result = this.game.placeCurrentShip(x, y);
        this.moveIndicator.textContent = this.getPlacementMessage(result);
        this.render();
    }

    handleAttackClick(boardIndex, cellElement) {
        // You can only attack your opponent's board, never your own.
        if (boardIndex !== this.game.getOpponentIndex()) return;

        const { x, y } = this.getCellCoords(cellElement);
        const result = this.game.attack(x, y);
        this.moveIndicator.textContent = result;
        this.render();

        this.maybeTriggerComputerTurn();
    }

    // If it's now the computer's turn, let it fire after a short delay
    // so the move doesn't feel instantaneous/jarring.
    maybeTriggerComputerTurn() {
        if (this.game.phase !== 'battle' || this.game.winner) return;
        if (!this.game.currentPlayer.isComputer) return;

        this.setBoardsDisabled(true);
        this.moveIndicator.textContent = `${this.game.currentPlayer.name} is choosing a target...`;

        setTimeout(() => {
            const result = this.game.takeComputerTurn();
            this.moveIndicator.textContent = result ?? this.moveIndicator.textContent;
            this.render();
            this.setBoardsDisabled(false);
        }, COMPUTER_MOVE_DELAY_MS);
    }

    setBoardsDisabled(disabled) {
        this.boardElements.forEach(el => el.classList.toggle('boards-disabled', disabled));
    }

    getCellCoords(cell) {
        return {
            x: Number(cell.dataset.x),
            y: Number(cell.dataset.y),
        };
    }

    getPlacementMessage(result) {
        if (result !== 'Ship placed') {
            return result;
        }

        if (this.game.phase === 'battle') {
            return `All ships placed. ${this.game.currentPlayer.name} attacks first.`;
        }

        return `${this.game.placementPlayer.name}, place your ${this.game.shipToPlace.name}.`;
    }

    render() {
        const revealAll = this.game.phase === 'finished';

        this.game.players.forEach((player, index) => {
            // Visibility is fixed, not turn-based: the human's own board is
            // always visible, the computer's board is always hidden — never
            // flips just because it's momentarily the computer's turn.
            // At game end, both fleets are revealed.
            const hideShips = revealAll ? false : player.isComputer;
            this.renderBoard(this.boardElements[index], player.gameBoard, hideShips);
        });

        // Always show the human's own fleet status, not whoever's "active" —
        // the computer's turn shouldn't flip this panel to its fleet.
        this.renderFleetStatus(this.game.players[0]);
        this.renderLabels();
        this.renderControls();

        if (!this.moveIndicator.textContent) {
            this.moveIndicator.textContent = `${this.game.placementPlayer.name}, place your ${this.game.shipToPlace.name}.`;
        }
    }

    getActivePlayer() {
        if (this.game.phase === 'placement') {
            return this.game.placementPlayer;
        }

        return this.game.currentPlayer;
    }

    renderLabels() {
        this.game.players.forEach((player, index) => {
            this.boardLabels[index].textContent = `${player.name} Fleet`;
            this.boardViews[index].textContent = this.getViewText(index);
        });
    }

    getViewText(index) {
        const player = this.game.players[index];

        if (this.game.phase === 'placement') {
            return index === this.game.placementPlayerIndex ? 'Placement View' : 'Waiting';
        }

        if (this.game.phase === 'finished') {
            return this.game.winner === player ? 'Winner' : 'Defeated';
        }

        return index === this.game.currentPlayerIndex ? 'Defensive View' : 'Targeting View';
    }

    renderControls() {
        const orientationButtons = this.controls.querySelectorAll('[data-orientation]');

        orientationButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.orientation === this.game.selectedOrientation);
            button.disabled = this.game.phase !== 'placement';
        });
    }

    renderBoard(boardElement, board, hideShips) {
        boardElement.innerHTML = '';

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                const square = board.coordinates[x][y];

                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;

                if (square.ship && !hideShips) {
                    cell.classList.add('ship');
                }

                if (board.hits.some(hit => hit.x === x && hit.y === y)) {
                    cell.classList.add('hit');
                }

                if (board.misses.some(miss => miss.x === x && miss.y === y)) {
                    cell.classList.add('miss');
                }

                boardElement.appendChild(cell);
            }
        }
    }

    renderFleetStatus(player) {
        this.fleetStatusElement.innerHTML = '';

        player.getFleet().forEach(ship => {
            const item = document.createElement('li');

            const name = document.createElement('span');
            name.classList.add('name');
            name.textContent = ship.name;

            const hp = document.createElement('span');
            hp.classList.add('hp');

            for (let i = 0; i < ship.length; i++) {
                const square = document.createElement('span');
                square.textContent = '■';
                square.classList.add(i < ship.hits ? 'lost' : 'filled');
                hp.appendChild(square);
            }

            item.append(name, hp);
            this.fleetStatusElement.appendChild(item);
        });
    }
}