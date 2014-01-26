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
    tileSize = tileSize || canvas.tileSize;
    var tileSize = (typeof tileSize === 'number') ? tileSize : 10,
        context = canvas.getContext('2d'),
        collisionMatrix = [];

    // Define the canvas object interface
    var properties = {
        collisionMatrix: {
            value: {
                'get': function () {
                    return collisionMatrix;
                },
                'create': function (collisionMap) {
                    if (typeof collisionMap === 'object') {

                    } else {
                        // Fill the matrix with false values
                        for (var row = 0, rows = Math.floor(canvas.height/tileSize); row <= rows; row++) {
                            collisionMatrix[row] = new Array(columns);
                            for (var col = 0, columns = Math.floor(canvas.width/tileSize); col <= columns; col++) {
                                collisionMatrix[row][col] = Math.random() < 
                                (typeof collisionMap === 'undefined' ? 0 : collisionMap || 0.3);
                            }
                        }
                        return collisionMatrix;
                    }
                },
                'setValue': function (row, column, value) {
                    if (row <= canvas.grid.rows && column <= canvas.grid.columns) {
                        collisionMatrix[row][column] = value;
                    }
                },
                'getValue': function (row, column) {
                    if (row <= canvas.grid.rows && column <= canvas.grid.columns) {
                        return collisionMatrix[row][column];
                    }
                },
                'check': function (x, y) {
                    var tileSize = canvas.grid.tileSize,
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
                'toggle': function (row, column) {
                    var matrix = canvas.collisionMatrix.get();
                    matrix[row][column] = !matrix[row][column];
                }
            }
        },
        'setSize': {
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