let gameContainer = document.querySelector("#game-container");
let tileArray = new Array();

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

function associateTileWithObject() {
    let gameTilesList = document.querySelectorAll(".game-tile");

    gameTilesList.forEach( (gameTile) => {
        gameTile.addEventListener("click", (e) => {
            let tileId = e.target.getAttribute("id");
            console.log(tileArray.filter( (tile) => {
                if (tile["id"] === tileId) {
                    return true;
                }
            } ))
        })

    } )
}

createGameTiles();
associateTileWithObject();