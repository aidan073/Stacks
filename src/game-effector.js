// Functions that affect the game state as it is being played

// Handle whenever a tile is clicked
function handleTileClick(e, reds, blues){
    const tile = e.currentTarget;
    if(!tile.classList.contains("has-piece")){
        return;
    }
    // tile contains a piece
    let piece;
    const pieceName = tile.firstElementChild.id;
    if(reds[pieceName]){
        piece = reds[pieceName];
    }
    else{
        piece = blues[pieceName];
    }
    alert(`You clicked tile ${tile.dataset.row}, ${tile.dataset.column}. It contains: ${piece.type} for team ${piece.team}`);
}

// Place a piece onto a tile
function setPieceOnTile(piece, tile){
    tile.classList.add('has-piece');
    const image = document.createElement("img");
    image.src = `../imgs/pieces/${piece.name}.png`;
    image.id = piece.name;
    image.class = "piece-img";
    tile.appendChild(image);
}

// Remove a piece from a tile
function removePieceFromTile(piece, tile) {
    const pieceImg = tile.querySelector(`#${piece.name}`);
    if(pieceImg) {
        pieceImg.remove();
        if(!tile.querySelector(".piece-img")){
            tile.classList.remove('has-piece');
        }
    }
}

// Reset board back to initial state
function resetBoard(){
    return;
}   

export { handleTileClick, setPieceOnTile, removePieceFromTile, resetBoard };