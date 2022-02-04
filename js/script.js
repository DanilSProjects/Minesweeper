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
            "bombsAround": 0,
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
    for (let i = 1; i <= 10;) {
        let bombX = Math.ceil(Math.random() * 9);
        let bombY = Math.ceil(Math.random() * 9);
        let bombCoordinates = {
            "x-position": bombX,
            "y-position": bombY,
        };
        if (bombArray.includes(bombCoordinates) === false) {
            bombArray.push(bombCoordinates);
            i++;
        }
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
        addNeighbour(neighbours, tileX, tileY);
        neighbours.forEach( (neighbour) => {
            bombArray.forEach( (bomb) => {
                if (neighbour["x-position"] === bomb["x-position"] && neighbour["y-position"] === bomb["y-position"]) {
                    bombsAround += 1;
                }
            })
        })
    tile["bombsAround"] = bombsAround;
    } )
}

function addNeighbour(neighboursArray, xPos, yPos) {
    for (let i = xPos - 1; i <= xPos + 1; i++) {
        for (let j = yPos - 1; j<= yPos +1; j++) {
            let neighbourCoordinates = {
                "x-position": i,
                "y-position": j,
            }
            if ((i === xPos && j === yPos) === false && i >= 1 && j >= 1 && i <= containerSide && j <= containerSide && neighboursArray.includes(neighbourCoordinates) === false) {
                neighboursArray.push(neighbourCoordinates)
            }
        }
    }
}

// If user clicked on a "0" tile, all the neighbouring non-bombs will open
function selectedZero(xPos, yPos) {
    let neighbours = [];
    addNeighbour(neighbours, xPos, yPos);
    neighbours.forEach( (tile) => {

        tileArray.forEach( (object) => {
            if (object["x-position"] === tile["x-position"] && object["y-position"] === tile["y-position"]) {
                tile.isBomb = object.isBomb;
                tile.bombsAround = object.bombsAround;
            }
        } )


        let tileId = 9 * (tile["y-position"] - 1) + tile["x-position"];
        let gameTile = document.querySelector(`#tile_${tileId}`);
        if (gameTile.classList.contains("revealed-empty") === false && tile.isBomb === false && tile.bombsAround === 0) {
            gameTile.classList.add("revealed-empty");
            selectedZero(tile["x-position"], tile["y-position"])
        } else if (tile.isBomb === false && tile.bombsAround > 0 && gameTile.innerHTML === "") {
            let bombNumber = document.createElement("p");
            bombNumber.textContent = tile.bombsAround;
            bombNumber.classList.add("bomb-number");
            gameTile.classList.add("revealed-empty")
            gameTile.appendChild(bombNumber);
        }
    } )
}

// Associate tile objects with each game tile
function associateTileWithObject() {
    let gameTilesList = document.querySelectorAll(".game-tile");

    gameTilesList.forEach( (gameTile) => {
        gameTile.addEventListener("click", userTileClick)

    } )
}

function userTileClick(e) {
    if (e.target.classList.contains("revealed-empty") === false) {
        let tileId = e.target.getAttribute("id");
        let chosenTileObject = tileArray.filter( (tile) => {
            if (tile["id"] === tileId) {
                return true;
            }
        } )[0];
        
        if (chosenTileObject.isBomb === false && chosenTileObject.bombsAround === 0) {
            selectedZero(chosenTileObject["x-position"], chosenTileObject["y-position"])
        }
    
        if (chosenTileObject.isBomb === false && chosenTileObject.bombsAround > 0 &&  e.target.innerHTML === "") {
            let bombNumber = document.createElement("p");
            bombNumber.textContent = chosenTileObject.bombsAround;
            bombNumber.classList.add("bomb-number");
            e.target.appendChild(bombNumber);
        }
        if (chosenTileObject && chosenTileObject.isBomb === true) {
            e.target.classList.add("revealed-bomb");
        } else {
            e.target.classList.add("revealed-empty");
        }
    }
}

createGameTiles();
associateTileWithObject();
generateBombCoordinates();
labelBombTiles();
determineBombsAround();