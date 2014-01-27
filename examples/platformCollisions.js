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
var radius = 30,
    ball = {
        box: {
            x: 190,
            y: 50,
            left: radius,
            right: radius,
            top: radius,
            bottom: radius
        },
        radius: radius
    };

var platforms = [
    // row, fromColumn, toColumn
    [5, 5, 8],
    [5, 10, 13],
    [10, 5, 5],
    [10, 7, 13],
    [15, 5, 13],
    [8, 11, 13],
    [9, 11, 13],
    [14, 5, 8],
    [13, 8, 8]
];
(function createPlatforms() {
    platforms.forEach(function (platform) {
        for (var row = platform[0], col = platform[1], lastColumn = platform[2]; 
            col <= lastColumn; col++) {
            canvas.collisionMatrix.setValue(row, col, true);
            canvas.grid.drawTile(row, col);
        }
    });
})();

// RENDER
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

// REMOVE TILES
var tile;
removeTiles = [[5, 8], [5, 10], [9, 11], [9, 12], [10, 12], [14, 8], [14, 7], [14, 6], [0, 0]];
var remove = setInterval(function () {
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
}, 5000);
setTimeout(function () {
    radius = ball.radius = ball.box.top = ball.box.bottom = ball.box.left = ball.box.right = 15; 
    deltaX = -7;
}, 6000);
setTimeout(function () {
    radius = ball.radius = ball.box.top = ball.box.bottom = ball.box.left = ball.box.right = 10;
}, 7000);
setTimeout(function () {
    radius = ball.radius = ball.box.top = ball.box.bottom = ball.box.left = ball.box.right = 15;
}, 8000);
setTimeout(function () {
    deltaX = 0;
    deltaY = -7;
}, 9000);
setTimeout(function () {
    radius = ball.radius = ball.box.top = ball.box.bottom = ball.box.left = ball.box.right = 10;
    ball.box.x -= 5;
}, 10000);
setTimeout(function () {
    radius = ball.radius = ball.box.top = ball.box.bottom = ball.box.left = ball.box.right = 20;
}, 11000);