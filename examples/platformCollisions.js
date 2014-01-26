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
var radius = 10,
    ball = {
    x: 190,
    y: 50,
    box: {
        left: -radius,
        right: radius,
        top: radius,
        bottom: radius
    },
    radius: radius
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
    var copy = {
        x: ball.x,
        y: ball.y + 7
    };
    // Collision check
    if (copy.y > ball.y) {
        var tile = canvas.collisionMatrix.check(copy.x, copy.y + ball.box.bottom);
        if (!tile.collision) {
            ball.y = copy.y;
        } else {
            ball.y = tile.top - ball.box.bottom;
        }
    } else {
        var tile = canvas.collisionMatrix.check(copy.x, copy.y - ball.box.top);
        if (!tile.collision) {
            ball.y = copy.y;
        } else {
            ball.y = tile.bottom + ball.box.top; console.log(ball.y)
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