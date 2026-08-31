const { Ship } = require("../ship.js");

describe("Ship", () => {
  test("creates a ship with a name, length, and default status", () => {
    const ship = new Ship("carrier", 5);

    expect(ship.name).toBe("carrier");
    expect(ship.length).toBe(5);
    expect(ship.hits).toBe(0);
    expect(ship.sunk).toBe(false);
  });

  test("hit increases the ship hit count", () => {
    const ship = new Ship("destroyer", 2);

    ship.hit();
    ship.hit();

    expect(ship.hits).toBe(2);
  });

  test("isSunk marks the ship as sunk when hits are equal to length", () => {
    const ship = new Ship("submarine", 3);

    ship.hit();
    ship.hit();
    ship.hit();
    ship.isSunk();

    expect(ship.sunk).toBe(true);
  });

  test("isSunk keeps the ship afloat when hits are less than length", () => {
    const ship = new Ship("battleship", 4);

    ship.hit();
    ship.isSunk();

    expect(ship.sunk).toBe(false);
  });
});
