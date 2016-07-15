// todo: add tectonics

var PLANET = {
    WIDTH  : 30,
    HEIGHT : 24
};

function initPlanetMassArray() {
    this.state.planetMassArray = [];

    for (var h = 0; h < PLANET.HEIGHT; h++) {
        var massArrayRow = [];
        for (var w = 0; w < PLANET.WIDTH; w++) {
            massArrayRow.push({
                land  : 0,
                water : 0
            });
        }
        this.state.planetMassArray.push(massArrayRow);
    }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mass
 */
function addMassToTile(x, y, mass) {
    // "Spherical" wraparound
    if (x < 0) {
        x = -(x % PLANET.WIDTH);
    }
    if (x >= PLANET.WIDTH) {
        x = x % PLANET.WIDTH;
    }
    if (y < 0) {
        y = -(y % PLANET.HEIGHT);
    }
    if (y >= PLANET.HEIGHT) {
        y = y % PLANET.HEIGHT;
    }
    this.state.planetMassArray[y][x].land += mass;
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mass
 */

var PROBABILITY_EDGE_FILL = 0.8;

function addMassToRegion(x, y, mass) {
    addMassToTile.call(this, x, y, mass);

    if (mass > 1) {
        var extraMass = function () {
            return Math.random() < PROBABILITY_EDGE_FILL ? (0.5 * mass) : 0;
        };

        addMassToTile.call(this, x - 1, y - 1, extraMass());
        addMassToTile.call(this, x, y - 1, extraMass());
        addMassToTile.call(this, x + 1, y - 1, extraMass());
        addMassToTile.call(this, x - 1, y, extraMass());
        addMassToTile.call(this, x + 1, y, extraMass());

        addMassToTile.call(this, x - 1, y + 1, extraMass());
        addMassToTile.call(this, x, y + 1, extraMass());
        addMassToTile.call(this, x + 1, y + 1, extraMass());
    }
}

function walkFaultLine() {
    var startingEdge = 'NESW'[(Math.random() * 4) >> 0];
    var isBigWalk    = Math.random() < 0.25;

    var x, y;
    var dx = Math.random();
    var dy = Math.random();

    if (startingEdge === 'N') {
        x = Math.floor(Math.random() * PLANET.WIDTH);
        y = 0;
        if (Math.random() < 0.5) {
            dx *= -1;
        }
    } else if (startingEdge === 'E') {
        x = PLANET.WIDTH - 1;
        y = Math.floor(Math.random() * PLANET.HEIGHT);
        dy *= -1;
        if (Math.random() < 0.5) {
            dx *= -1;
        }
    } else if (startingEdge === 'S') {
        x = Math.floor(Math.random() * PLANET.WIDTH);
        y = PLANET.HEIGHT - 1;
        dy *= -1;
        if (Math.random() < 0.5) {
            dx *= -1;
        }
    } else if (startingEdge === 'W') {
        x = 0;
        y = Math.floor(Math.random() * PLANET.HEIGHT);
        if (Math.random() < 0.5) {
            dy *= -1;
        }
    }

    var steps = Math.floor(Math.random() * Math.max(PLANET.WIDTH, PLANET.HEIGHT) * 0.4) + 10;

    for (; steps > 0; steps--) {
        addMassToRegion.call(this, Math.round(x), Math.round(y), isBigWalk ? 2 : 1);
        x += dx;
        y += dy;
    }
}

function getColorLevel(value) {
    var level = 0;

    if (value > 1) {
        level = 1;
    }
    if (value > 3) {
        level = 2;
    }
    if (value > 6) {
        level = 3;
    }
    if (value > 11) {
        level = 4;
    }

    return level;
}

function getPlanetMassTileHTML(tile) {
    return [
        '<span class="tile" data-level="' + getColorLevel(tile.land) + '">',
        tile.land + tile.water,
        '</span>'
    ].join('\n');
}

function getPlanetMassArrayRowHTML(row) {
    return row
        .map(getPlanetMassTileHTML)
        .join('\n');
}

function getPlanet() {
    initPlanetMassArray.call(this);

    for (var i = 40; i > 0; i--) {
        walkFaultLine.call(this);
    }

    return [
        '<div id=planet>',
        this.state.planetMassArray.map(getPlanetMassArrayRowHTML).join('<br>'),
        '</div>'
    ].join('\n');
}

function onClick(e) {
    var target = e.target;
    console.log(target);
}

function bindPlanet() {
    var el     = document.getElementById('planet');
    el.onclick = onClick;
}

module.exports = function addPlanetGeneration(app) {
    app.getPlanet = getPlanet;
    app.onDocumentCloseFuncs.push(bindPlanet);
};