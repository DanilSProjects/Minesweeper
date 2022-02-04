let gameContainer = document.querySelector("#game-container");
let tileArray = new Array();
let bombArray = new Array();

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

// Associate tile objects with each game tile
function associateTileWithObject() {
    let gameTilesList = document.querySelectorAll(".game-tile");

    gameTilesList.forEach( (gameTile) => {
        gameTile.addEventListener("click", userTileClick)

    } )
}

function userTileClick(e) {
    let tileId = e.target.getAttribute("id");
    console.log(tileArray.filter( (tile) => {
        if (tile["id"] === tileId) {
            return true;
        }
    } ))
}

createGameTiles();
associateTileWithObject();
generateBombCoordinates();
labelBombTiles();
console.log(bombArray)