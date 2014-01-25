var canvas = document.getElementById('collidableCanvas'),
    context = canvas.getContext('2d');
    canvas.tileSize = 20;

CollidableCanvas.extend(canvas);

if (TiledCanvas) {
    TiledCanvas.extend(canvas);
    canvas.setSize();
    canvas.grid.setSize();
    canvas.collisionMatrix.create();
}

// PLATFORM GAME OBJECTS
var platforms = [
    // row, fromColumn, toColumn
    [5, 5, 13],
    [10, 5, 13],
    [15, 5, 13],
];
var ball = {
    x: 190,
    y: 50,
    radius: 10
};

(function createPlatforms() {
    platforms.forEach(function (platform) {
        for (var row = platform[0], col = platform[1], lastColumn = platform[2]; 
            col <= lastColumn; col++) {
            canvas.collisionMatrix.setValue(row, col, true);
            canvas.grid.drawTile(row, col);
        }
    });
})();
function drawPlatforms() {
    platforms.forEach(function (platform) {
        for (var row = platform[0], col = platform[1], lastColumn = platform[2]; 
            col <= lastColumn; col++) {
            if (canvas.collisionMatrix.getValue(row, col)) {
                canvas.grid.drawTile(row, col);
            }
        }
    });
};

// Render
setInterval(function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Platforms
    drawPlatforms();
    // Object copy
    var ballCopy = {
        x: ball.x,
        y: ball.y + 10
    };
    // Collision check
    if (ballCopy.x <= canvas.width && ballCopy.y <= canvas.height) {
        var tile = canvas.collisionMatrix.check(ballCopy.x, ballCopy.y);
        if (!tile.collision) {
            ball.y = ballCopy.y;
        }
    }
    // Drawing
    context.fillStyle = '#aaa';
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    context.fill();   
}, 33);

// Remove tiles
removeTiles = [[5, 9], [10, 9], [15, 9]];
setInterval(function () {
    var tile;
    if ((tile = removeTiles.shift()))
        canvas.collisionMatrix.setValue(tile[0], tile[1], false);
}, 1000);