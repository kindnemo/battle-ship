export class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    // Hit function 
    hit() {
        this.hits += 1;
    }

    // isSunk function
    isSunk() {
       this.sunk = this.hits >= this.length;
       return this.sunk;
    }
}
