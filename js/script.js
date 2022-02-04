let gameContainer = document.querySelector("#game-container");
let tileArray = new Array();
let bombArray = new Array();
let containerSide = 9;

// Add game tiles to game-container and create initial tile objects
function createGameTiles() {
    for (let i = 1; i <= 81; i++) {
        let tile = document.createElement("div");
        tile.setAttribute('id', `tile_${i}`);
        tile.classList.add("game-tile");
        tileObject = {
            "id":tile.getAttribute('id'),
            "x-position": 1,
            "y-position": 1,
            "isBomb":false,
            "bombsAround": [],
        }
        tileObject["x-position"] = (i % 9 === 0) ? 9 : i % 9;
        let existingTiles = ["placeholder"];
        let yPos = 1;
        tileArray.forEach( (existingTile) => {
            if (existingTile["x-position"] === tileObject["x-position"]){
                yPos = existingTiles.push(existingTile);
            }
            tileObject["y-position"] = yPos;
        } )
        tileArray.push(tileObject);
        gameContainer.appendChild(tile);
    }
}

// Generate bomb coordinates and associate them with respective tiles
function generateBombCoordinates() {
    for (let i = 1; i <= 10; i++) {
        let bombX = Math.ceil(Math.random() * 9);
        let bombY = Math.ceil(Math.random() * 9);
        let bombCoordinates = {
            "x-position": bombX,
            "y-position": bombY,
        };
        bombArray.push(bombCoordinates);
    }
}

function labelBombTiles() {
    bombArray.forEach( (bomb) => {
        bombId = 9 * (bomb["y-position"] - 1) + bomb["x-position"];
        tileArray.forEach((tile) => {
            if (tile["id"] === `tile_${bombId}`) {
                tile["isBomb"] = true;
            }
        })
    })

}

// Look at neighbours and determine the number of bombs in the vicinity
function determineBombsAround() {
    tileArray.forEach( (tile) => {
        let neighbours = [];
        let bombsAround = 0;
        let tileX = tile["x-position"];
        let tileY = tile["y-position"];

        // Diagonal neighbours (I know it looks awful...)
        if (tileX === 1 && tileY === 1) {
            addNeighbour(neighbours, (tileX + 1), (tileY + 1));
        } else if (tileX === 1 && tileY === containerSide) {
            addNeighbour(neighbours, (tileX + 1), (tileY - 1));
        } else if (tileX === containerSide && tileY === 1) {
            addNeighbour(neighbours, (tileX - 1), (tileY + 1));
        } else if (tileX === containerSide && tileY === containerSide) {
            addNeighbour(neighbours, (tileX - 1), (tileY - 1));
        } else {

            if (tileX === 1) {
                addNeighbour(neighbours, (tileX + 1), (tileY + 1));
                addNeighbour(neighbours, (tileX + 1), (tileY - 1));
            } else if (tileX === containerSide) {
                addNeighbour(neighbours, (tileX - 1), (tileY + 1));
                addNeighbour(neighbours, (tileX - 1), (tileY - 1));
            } else {
                if (tileY === 1){
                    addNeighbour(neighbours, (tileX + 1), (tileY + 1));
                    addNeighbour(neighbours, (tileX - 1), (tileY + 1));
                } else if (tileY === containerSide) {
                    addNeighbour(neighbours, (tileX + 1), (tileY - 1));
                    addNeighbour(neighbours, (tileX - 1), (tileY - 1));
                } else {
                    addNeighbour(neighbours, (tileX + 1), (tileY + 1));
                    addNeighbour(neighbours, (tileX + 1), (tileY - 1));
                    addNeighbour(neighbours, (tileX - 1), (tileY + 1));
                    addNeighbour(neighbours, (tileX - 1), (tileY - 1));
                }
            }
        }

        // Vertical neighbours
        switch (tileY) {
            case 1:
                addNeighbour(neighbours, tileX, (tileY + 1));
                break;
            case containerSide:
                addNeighbour(neighbours, tileX, (tileY - 1));
                break;
            default:
                addNeighbour(neighbours, tileX, (tileY + 1));
                addNeighbour(neighbours, tileX, (tileY - 1));
        }

        // Horizontal neighbours
        switch (tileX) {
            case 1:
                addNeighbour(neighbours, (tileX + 1), tileY);
                break;
            case containerSide:
                addNeighbour(neighbours, (tileX - 1), tileY);
                break;
            default:
                addNeighbour(neighbours, (tileX + 1), tileY);
                addNeighbour(neighbours, (tileX - 1), tileY);
        }

        neighbours.forEach( (neighbour) => {
            tile.bombsAround.push(neighbour)
            bombArray.forEach( (bomb) => {
                if (neighbour["x-position"] === bomb["x-position"] && neighbour["y-position"] === bomb["y-position"]) {
                    bombsAround += 1;
                }
            })
        })
    tile.bombsAround = bombsAround;
    } )
}

function addNeighbour(neighboursArray, xPos, yPos) {
    neighboursArray.push({
        "x-position": xPos,
        "y-position": yPos,
    })
}

// Associate tile objects with each game tile
function associateTileWithObject() {
    let gameTilesList = document.querySelectorAll(".game-tile");

    gameTilesList.forEach( (gameTile) => {
        gameTile.addEventListener("click", userTileClick)

    } )
}

function userTileClick(e) {
    let tileId = e.target.getAttribute("id");
    let chosenTileObject = tileArray.filter( (tile) => {
        if (tile["id"] === tileId) {
            return true;
        }
    } )[0];
    console.log(chosenTileObject)
    if (chosenTileObject.isBomb === true) {
        e.target.classList.add("revealed-bomb")
    }
}

createGameTiles();
associateTileWithObject();
generateBombCoordinates();
labelBombTiles();
determineBombsAround();
console.log(bombArray)