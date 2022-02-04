let gameContainer = document.querySelector("#game-container");
for (let i = 1; i <= 81; i++) {
    let tile = document.createElement("div");
    tile.setAttribute('id', `tile_${i}`);
    tile.classList.add("game-tile")
    gameContainer.appendChild(tile);
}