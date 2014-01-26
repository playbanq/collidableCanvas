/** Creates a tile-based grid and extends a canvas element with the related methods
 * @param {object} canvas - The canvas element object obtained from document.getElementById
 * @param {number} tileSize - The size of the tiles of the grid
 * @returns {object} - An object containing the methods used to extend the initial canvas object
 */
var CollidableCanvas = Object.create({}, {
    'extend': {
        value: collidableCanvas
    }
});

function collidableCanvas(canvas, tileSize) {
    // Validate that the canvas parameter is indeed an existing canvas element
    if (canvas.nodeName !== 'CANVAS') {
        console.log('ERROR: The element provided is not a canvas element.');
        return;
    }

    // Check what parameters were specified, or used the default values
    var context = canvas.getContext('2d'),
        collisionMatrix = [];

    // Define the canvas object interface
    var properties = {
        collisionMatrix: {
            value: {
                get: function () {
                    return collisionMatrix;
                },
                create: function (numRows, numCols, collisionMap) {
                    var args = Array.prototype.slice.call(arguments);
                    if (args.length === 1) { 
                        collisionMap = numRows;
                        numRows = undefined;
                    }
                    var isMap = (collisionMap instanceof Array),
                        isNumber = (typeof collisionMap === 'number'),
                        rows = numRows || canvas.grid.rows,
                        columns = numCols || canvas.grid.columns,
                        value;

                    if (isMap) {

                    } else {
                        // Fill the matrix with false values
                        for (var row = 0; row <= rows; row++) {
                            collisionMatrix[row] = [];
                            for (var col = 0; col <= columns; col++) {
                                value = (isNumber ? Math.random() < collisionMap : false);
                                collisionMatrix[row][col] = value;
                            }
                        }
                        return collisionMatrix;
                    }
                },
                setValue: function (row, column, value) {
                    if (row <= canvas.grid.rows && column <= canvas.grid.columns) {
                        collisionMatrix[row][column] = value;
                    }
                },
                getValue: function (row, column) {
                    if (row <= canvas.grid.rows && column <= canvas.grid.columns) {
                        return collisionMatrix[row][column];
                    }
                },
                check: function (x, y) {
                    var tileSize = canvas.tileSize || canvas.grid.tileSize,
                        row = Math.floor(y/tileSize),
                        column = Math.floor(x/tileSize),
                        rowValue = canvas.collisionMatrix.get()[row],
                        tileValue = (rowValue) ? rowValue[column] : undefined;
                    
                    return {
                        top: row * tileSize,
                        bottom: row * tileSize + tileSize,
                        right: column * tileSize + tileSize,
                        left: column * tileSize,
                        size: tileSize,
                        row: row,
                        column: column,
                        collision: tileValue
                    };
                },
                checkVertical: function (box, target) {
                    var allowedPosition = {},
                        tileSize = canvas.tileSize || canvas.grid.tileSize,
                        row, column, rowValue, tileValue;
                        
                    if (target.y > box.y) {
                        // var tile = canvas.collisionMatrix.check(target.x, target.y + box.bottom);
                        row = Math.floor((target.y + box.bottom)/tileSize);
                        column = Math.floor(target.x/tileSize);
                        rowValue = canvas.collisionMatrix.get()[row];
                        tileValue = (rowValue) ? rowValue[column] : undefined;
                        if (!tileValue) {
                            allowedPosition.y = target.y;
                        } else {
                            allowedPosition.y = row * tileSize - box.bottom;
                        }
                    } else if (target.y < box.y) {
                        row = Math.floor((target.y - box.top)/tileSize);
                        column = Math.floor(target.x/tileSize);
                        rowValue = canvas.collisionMatrix.get()[row];
                        tileValue = (rowValue) ? rowValue[column] : undefined;
                        if (!tileValue) {
                            allowedPosition.y = target.y;
                        } else {
                            allowedPosition.y = row * tileSize + tileSize + box.top;
                        }
                    }
                    return allowedPosition;
                },
                toggle: function (row, column) {
                    var matrix = canvas.collisionMatrix.get();
                    matrix[row][column] = !matrix[row][column];
                }
            }
        },
        setSize: {
            writable: true,
            value: function (newWidth, newHeight) {
                canvas.width = newWidth || window.innerWidth;
                canvas.height = newHeight || window.innerHeight;
            }
        }
    }
    
    Object.defineProperties(canvas, properties);
    
    return Object.create({}, properties);
}