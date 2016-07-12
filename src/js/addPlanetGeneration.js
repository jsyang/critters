// todo: add techtonics


function getPlanet() {
    this.state.planetMassArray = [];

    return '<div id=planet>this is a description of the planet</div>';
}

function onClick() {
    alert('clicked on the planet display');
}

function bindPlanet() {
    var el = document.getElementById('planet');
    el.onclick = onClick;
}

module.exports = function addPlanetGeneration(app) {
    app.getPlanet = getPlanet;
    app.onDocumentCloseFuncs.push(bindPlanet);
};