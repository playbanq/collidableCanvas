var canvas = document.getElementById('collidableCanvas'),
    context = canvas.getContext('2d');
    canvas.tileSize = 20;

CollidableCanvas.extend(canvas);

if (TiledCanvas) {
    TiledCanvas.extend(canvas);
    canvas.setSize();
    canvas.grid.setSize();
    canvas.grid.draw();
    canvas.collisionMatrix.create();
}

if (ClickableCanvas) {
    ClickableCanvas.extend(canvas);
    canvas.onClick(function (x, y) {
        var tile = canvas.collisionMatrix.check(x, y),
            color = (tile.collision) ? '#fff' : '#ccc';
        canvas.grid.drawTile(tile.row, tile.column, color);
        canvas.collisionMatrix.toggle(tile.row, tile.column);
    });
}