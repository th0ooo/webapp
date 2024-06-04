function log(message) {
    console.log(message);
    $("#log").append("<p>" + message + "</p>");
}

function logDragStart(initialX, initialY, initialLeft, initialTop) {
    log(`Starting drag - initialX: ${initialX}, initialY: ${initialY}, initialLeft: ${initialLeft}, initialTop: ${initialTop}`);
}

function logDragEnd(left, top) {
    log(`Mouse up - final position left: ${left}, top: ${top}`);
}
