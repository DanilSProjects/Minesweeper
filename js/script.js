let gameContainer = document.querySelector("#game-container");
let tileArray = new Array();
let bombArray = new Array();
let containerSide = 9;
let bombNo = 10;
let bombsFlagged = 0;
let gameTilesList = [];
let revealedTilesList = [];
let currentDifficulty = "easy";

// Adjust difficulty
let difficultyRadioButtons = document.querySelectorAll("input[name='difficulty']");
difficultyRadioButtons.forEach( (button) => {
    button.addEventListener('change', (e) => {
        switch (e.target.value) {
            case "easy":
                containerSide = 9;
                bombNo = 10;
                currentDifficulty = "easy";
                restart();
                break;
            case "medium":
                containerSide = 16;
                bombNo = 40;
                currentDifficulty = "medium";
                restart();
                break;
            case "hard":
                containerSide = 24;
                bombNo = 100;
                currentDifficulty = "hard";
                restart();
                break;
        }
    })
})

function restart() {
    gameContainer.textContent = "";
    gameContainer.classList = currentDifficulty;
    bombArray = [];
    tileArray = [];
    bombsFlagged = 0;
    gameTilesList = [];
    revealedTilesList = [];

    try {
        let modal = document.querySelector(".modal");
        let mainBody = document.querySelector("body");
        mainBody.removeChild(modal);
        
    }
    catch {
        // No modal yet
    }

    try {
        let mainBody = document.querySelector("body");
        let replayButton = document.querySelector(".replay-button");
        mainBody.removeChild(replayButton);
    } catch {
        // No replay button yet
    }

    createGameTiles();
    associateTileWithObject();
    generateBombCoordinates();
    labelBombTiles();
    determineBombsAround();
}

// Add game tiles to game-container and create initial tile objects
function createGameTiles() {
    for (let i = 1; i <= (containerSide * containerSide); i++) {
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
        tileObject["x-position"] = (i % containerSide === 0) ? containerSide : i % containerSide;
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
    gameTilesList = document.querySelectorAll(".game-tile")
}

// Generate bomb coordinates and associate them with respective tiles
function generateBombCoordinates() {
    for (let i = 1; i <= bombNo;) {
        let bombX = Math.ceil(Math.random() * containerSide);
        let bombY = Math.ceil(Math.random() * containerSide);
        let bombId = containerSide * (bombY - 1) + bombX;
        let bombCoordinates = {
            "x-position": bombX,
            "y-position": bombY,
            "bomb-id": `tile_${bombId}`,
        };

        let allBombIds = bombArray.map( bomb => bomb["bomb-id"])
        if (allBombIds.includes(bombCoordinates["bomb-id"]) === false) {
            bombArray.push(bombCoordinates);
            i++;
        }
    }
}

function labelBombTiles() {
    bombArray.forEach( (bomb) => {
        let bombId = containerSide * (bomb["y-position"] - 1) + bomb["x-position"];
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


        let tileId = containerSide * (tile["y-position"] - 1) + tile["x-position"];
        let gameTile = document.querySelector(`#tile_${tileId}`);
        if (gameTile.classList.contains("revealed-empty") === false && tile.isBomb === false && tile.bombsAround === 0) {
            gameTile.classList.add("revealed-empty");
            revealedTilesList.push(gameTile);
            selectedZero(tile["x-position"], tile["y-position"])
        } else if (tile.isBomb === false && tile.bombsAround > 0 && gameTile.innerHTML === "") {
            let bombNumber = document.createElement("p");
            bombNumber.textContent = tile.bombsAround;
            bombNumber.classList.add("bomb-number");
            bombNumber.classList.add("number-" + tile.bombsAround);
            gameTile.classList.add("revealed-empty")
            gameTile.appendChild(bombNumber);
            revealedTilesList.push(gameTile);
        }
    } )
}

// Associate tile objects with each game tile
function associateTileWithObject() {
    gameTilesList.forEach( (gameTile) => {
        gameTile.addEventListener("click", userTileClick);
        gameTile.addEventListener("contextmenu", tileFlagged)
    } )
}

// Left click function
function userTileClick(e) {
    if (e.target.parentNode.getAttribute('id') === "game-container" && e.target.classList.contains("revealed-empty") === false && e.target.classList.contains("flagged-tile") === false) {
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
            revealedTilesList.push(e.target);
            let bombNumber = document.createElement("p");
            bombNumber.textContent = chosenTileObject.bombsAround;
            bombNumber.classList.add("bomb-number");
            bombNumber.classList.add("number-" + chosenTileObject.bombsAround);
            e.target.appendChild(bombNumber);
        }
        if (chosenTileObject && chosenTileObject.isBomb === true) {
            e.target.classList.add("revealed-bomb");
            lose();
        } else {
            e.target.classList.add("revealed-empty");
        }
        checkForWin();
    }
}

// Right click function (flag the tile)
function tileFlagged(e) {
    let selectedTile = e.target;
    let addingFlag = true;

    if (e.target.parentNode.classList.contains("game-tile")) {
        selectedTile = e.target.parentNode;
    }

    // Add/remove flag if needed
    if (selectedTile.classList.contains("revealed-empty") === false && selectedTile.classList.contains("flagged-tile") === false) {
        addingFlag = true;
        let flagImage = document.createElement("img");
        flagImage.setAttribute("src", "./images/flag.png");
        flagImage.classList.add("flag");
        selectedTile.classList.add("flagged-tile");
        selectedTile.appendChild(flagImage);
        revealedTilesList.push(selectedTile);
    } else if (selectedTile.classList.contains("flagged-tile")) {
        addingFlag = false;
        selectedTile.removeChild(selectedTile.children[0]);
        selectedTile.classList.remove("flagged-tile");
        let indexOfTile = revealedTilesList.indexOf(selectedTile);
        revealedTilesList.splice(indexOfTile, 1);
    }

    // Check if user flagged a bomb
    let selectedTileId = selectedTile.getAttribute('id');
    bombArray.forEach((bomb) => {
        if (selectedTileId === bomb["bomb-id"]) {
            switch (addingFlag) {
                case true:
                    bombsFlagged += 1;
                    break;
                case false:
                    bombsFlagged -= 1;
                    break;
            }
        }
    })
    checkForWin();
}

// Victory/defeat functions to end game

function checkForWin() {
    if (revealedTilesList.length === (containerSide * containerSide - (bombNo - bombsFlagged)) || bombsFlagged === bombNo) {
        win();
    }
}

function win() {
    gameOver("Victory!")
}

function lose() {
   gameOver("Defeat!")
}

function gameOver(text) {
    gameTilesList.forEach( (tile) => {
        bombArray.forEach( (bomb) => {
            if (tile.getAttribute("id") === bomb["bomb-id"]) {
                tile.classList.add("revealed-bomb")
            } else {
                tile.classList.add("revealed-empty")
            }
        })
    })

    let mainBody = document.querySelector("body");

    let modalDiv = document.createElement("div");
    let modalContentDiv = document.createElement("div");
    modalDiv.classList.add("modal");
    modalContentDiv.classList.add("modal-content");

    let headerDiv = document.createElement("div");
    headerDiv.classList.add("game-over-header");
    let smiley = document.createElement("img");
    if (text === "Victory!") {
        smiley.setAttribute("src", "./images/smiley-win.png")
    } else if (text = "Defeat!"){
        smiley.setAttribute("src", "./images/smiley-lose.png")
    }
    let gameOverMessage = document.createElement("h2");
    gameOverMessage.textContent = text;
    let replayButton = document.createElement("button");
    replayButton.textContent = "Play again?";
    replayButton.classList.add("replay-button");
    replayButton.addEventListener('click', restart);

    let closeButton = document.createElement("span");
    closeButton.textContent = "X";
    closeButton.classList.add("close-button");
    closeButton.addEventListener("click", () => {
        mainBody.removeChild(modalDiv);
        mainBody.appendChild(replayButton);
    })

    headerDiv.appendChild(smiley);
    headerDiv.appendChild(gameOverMessage);
    modalContentDiv.appendChild(closeButton);
    modalContentDiv.appendChild(headerDiv);
    modalContentDiv.appendChild(replayButton);
    modalDiv.appendChild(modalContentDiv);
    mainBody.appendChild(modalDiv);
}

createGameTiles();
associateTileWithObject();
generateBombCoordinates();
labelBombTiles();
determineBombsAround();
