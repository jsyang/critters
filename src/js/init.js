var addPlanetGeneration = require('./addPlanetGeneration');

var app = {
    // Call these functions when the DOM is ready
    onDocumentCloseFuncs: [],
    state: {}
};

addPlanetGeneration(app);

window.app = app;

document.addEventListener('DOMContentLoaded', function(){
    app.onDocumentCloseFuncs.forEach(function(func){
        func();
    });
});