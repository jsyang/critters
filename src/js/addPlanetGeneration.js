var _ = require('lodash/array');

var APP;

var PLANET = {
    WIDTH: 32,
    HEIGHT: 28,
    DEFAULT_TILE_MASS: 50
};


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
    APP.planet.tiles[y][x] += mass;
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mass
 */

function addMassToRegion(x, y, mass) {
    addMassToTile(x, y, mass);

    function extraMass() {
        return (Math.random() * 50 + 25) * 0.01 * mass;
    }

    function extraMass2() {
        return (Math.random() * 25) * 0.01 * mass;
    }

    // 8 tiles around the center
    addMassToTile(x - 1, y - 1, extraMass());
    addMassToTile(x, y - 1, extraMass());
    addMassToTile(x + 1, y - 1, extraMass());

    addMassToTile(x - 1, y, extraMass());
    addMassToTile(x + 1, y, extraMass());

    addMassToTile(x - 1, y + 1, extraMass());
    addMassToTile(x, y + 1, extraMass());
    addMassToTile(x + 1, y + 1, extraMass());

    // Another perimeter
    addMassToTile(x - 2, y - 2, extraMass2());
    addMassToTile(x - 1, y - 2, extraMass2());
    addMassToTile(x, y - 2, extraMass2());
    addMassToTile(x + 1, y - 2, extraMass2());
    addMassToTile(x + 2, y - 2, extraMass2());

    addMassToTile(x - 2, y - 1, extraMass2());
    addMassToTile(x + 2, y - 1, extraMass2());

    addMassToTile(x - 2, y, extraMass2());
    addMassToTile(x + 2, y, extraMass2());

    addMassToTile(x - 2, y + 1, extraMass2());
    addMassToTile(x + 2, y + 1, extraMass2());

    addMassToTile(x - 2, y + 2, extraMass2());
    addMassToTile(x - 1, y + 2, extraMass2());
    addMassToTile(x, y + 2, extraMass2());
    addMassToTile(x + 1, y + 2, extraMass2());
    addMassToTile(x + 2, y + 2, extraMass2());

}

function walkFaultLine() {
    var startingEdge = 'NESW' [(Math.random() * 4) >> 0];

    var x = Math.random() * PLANET.WIDTH;
    var y = Math.random() * PLANET.HEIGHT;
    var dx = Math.random() - Math.random();
    var dy = Math.random() - Math.random();

    var steps = Math.max(Math.random() * 0.5 * PLANET.WIDTH, 4);

    for (; steps > 0; steps--) {
        addMassToRegion(
            Math.round(x),
            Math.round(y),
            Math.max(10, Math.random() * 60)
        );
        x += dx * 2;
        y += dy * 2;
    }
}

/** @type {number[]} **/
var COLOR_QUANTILES = [];

function getColorLevel(value) {
    for (var i = 0; value > COLOR_QUANTILES[i]; i++) {}
    return Math.max(i - 1, 0);
}

function computeColorLevelRanges() {
    var sortedTileValues = _.flatten(APP.planet.tiles).sort(function(a, b) {
        return a - b;
    });
    var uniqueValues = _.uniq(sortedTileValues);
    var probabilityOfValues = [];
    var lastValueIndex = 0;

    uniqueValues
        .forEach(function(value) {
            var lastIndexOfCurrentValue = sortedTileValues.lastIndexOf(value);

            probabilityOfValues.push(
                (lastIndexOfCurrentValue - lastValueIndex + 1) / sortedTileValues.length
            );

            lastValueIndex = lastIndexOfCurrentValue;
        });

    var cumulativeProbability = 0;
    var quantile = 1;

    probabilityOfValues
        .forEach(function(p, i) {
            cumulativeProbability += p;
            if (cumulativeProbability > quantile / 6) {
                COLOR_QUANTILES.push(uniqueValues[i]);
                quantile++;
            }
        });
}

var R2 = 255;
var G2 = 255;
var B2 = 204;

var R1 = 8;
var G1 = 104;
var B1 = 172;

function getColorCSS() {

    var dR = (R2 - R1) / (COLOR_QUANTILES.length + 1);
    var dG = (G2 - G1) / (COLOR_QUANTILES.length + 1);
    var dB = (B2 - B1) / (COLOR_QUANTILES.length + 1);

    var css = COLOR_QUANTILES
        .map(function(v, i) {
            var RGB = [
                (i + 1) * dR + R1,
                (i + 1) * dG + G1,
                (i + 1) * dB + B1
            ];
            return '#planet a[data-level="' + i + '"] { background-color : rgb(' + RGB.map(Math.round.bind(Math)) + '); }';
        })
        .join('\n');

    return '<style>' + css + '</style>';
}

function getTileHTML(tileMass) {
    return '<a data-level="' + getColorLevel(tileMass) + '" title="' + tileMass.toFixed(2) + '"></a>';
}

function getTileRowHTML(row) {
    return row
        .map(getTileHTML)
        .join('\n');
}

function erode() {}

function getPlanet() {
    return [
        '<div id=planet>',
        APP.planet.tiles
        .map(getTileRowHTML)
        .join('<br>'),
        '</div>'
    ].join('\n');
}

function init() {
    APP.planet.tiles = [];

    for (var h = 0; h < PLANET.HEIGHT; h++) {
        var tileRow = [];
        for (var w = 0; w < PLANET.WIDTH; w++) {
            tileRow.push(PLANET.DEFAULT_TILE_MASS);
        }

        APP.planet.tiles.push(tileRow);
    }

    // Create terrain
    for (var i = 20; i > 0; i--) {
        walkFaultLine();
    }

    computeColorLevelRanges();
}

function onClick(e) {
    //var target = e.target;
    //console.log(target);
}

function bindPlanet() {
    //var el = document.getElementById('planet');
    //el.onclick = onClick;
}

module.exports = function addPlanetGeneration(app) {
    APP = app;

    APP.planet = {
        get: getPlanet,
        erode: erode,
        computeColorLevelRanges: computeColorLevelRanges,
        getColorCSS: getColorCSS
    };

    init();

    app.onDocumentCloseFuncs.push(bindPlanet);
};