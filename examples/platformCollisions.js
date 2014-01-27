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
    [5, 5, 7],
    [5, 9, 13],
    [10, 5, 5],
    [10, 7, 13],
    [15, 5, 13],
    [8, 10, 13],
    [9, 10, 13],
    [14, 5, 8],
    [13, 8, 8]
];
var radius = 15,
    ball = {
        box: {
            x: 170,
            y: 50,
            left: radius,
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
var deltaX = 0, deltaY = 7;
setInterval(function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Platforms
    drawPlatforms();
    // Object copy
    var copy = {
        x: ball.box.x + deltaX,
        y: ball.box.y + deltaY
    };

    var allowedX = canvas.collisionMatrix.checkHorizontal(ball.box, copy);
    ball.box.x = copy.x = allowedX.x;
    allowedY = canvas.collisionMatrix.checkVertical(ball.box, copy);
    ball.box.y = allowedY.y;  

    // Drawing
    context.fillStyle = '#aaa';
    context.arc(ball.box.x, ball.box.y, ball.radius, 0, 2 * Math.PI);
    context.fill();   
}, 33);

// Remove tiles
removeTiles = [[5, 7], [5, 9], [9, 10], [9, 11], [9, 12], [10, 12], [14, 8], [14, 7], [14, 6], [0, 0], [10, 7], [10, 5]];
var remove = setInterval(function () {
    var tile;
    if ((tile = removeTiles.shift())) {
        canvas.collisionMatrix.setValue(tile[0], tile[1], false);
        return;
    }
    clearInterval(remove);
}, 1000);
setTimeout(function () {
    deltaX = 7;
}, 3000);
setTimeout(function () {
    radius = ball.radius = ball.box.top = ball.box.bottom = ball.box.left = ball.box.right = 10;
}, 4000);
setTimeout(function () {
    deltaX = 0;
}, 6000);
setTimeout(function () {
    radius = ball.radius = ball.box.top = ball.box.bottom = ball.box.left = ball.box.right = 15;
    ball.box.y -= 5; 
    deltaX = -7;
}, 7000);
setTimeout(function () {
    radius = ball.radius = ball.box.top = ball.box.bottom = ball.box.left = ball.box.right = 10;
}, 8000);
setTimeout(function () {
    radius = ball.radius = ball.box.top = ball.box.bottom = ball.box.left = ball.box.right = 15;
    ball.box.x += 5;
    deltaX = 0;
    deltaY = -7;
}, 10000);