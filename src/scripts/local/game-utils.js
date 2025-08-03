import { Numeric, Ghost, Brute } from "./game-classes.js";

// Convert [x,y] coord to tile id
const coordToTileName = coord => {
    if(coord[0] < 0 || coord[1] < 0 || coord[0] >= window.boardSize || coord[1] >= window.boardSize) return;
    return `tile${coord[0]*window.boardSize+coord[1]}`;
}

// Convert tile name to piece on that tile
const tileToPiece = {}; // {tile.id: piece}

// Convert the name (see redSpawns, blueSpawns) of a piece to an actual Piece object
function pieceNameToPiece(pieceName, currCoord){
    switch(pieceName[1]){
        case "G":
            return new Ghost(pieceName, currCoord);
        case "B":
            return new Brute(pieceName, currCoord);
        case "N":
            return new Numeric(pieceName, currCoord, parseInt(pieceName[pieceName.length-1]));
    }
}

// Clear piece move selection
function clearSelection(currPlayer){
    const tiles = document.getElementById("board").children;
    for(const tile of tiles){
        const potentialPiece = tileToPiece[tile.id];
        if(potentialPiece && potentialPiece.team === currPlayer) potentialPiece.isSelected = false;
        tile.classList.remove(`${currPlayer}-dot`);
        tile.classList.remove(`${currPlayer}-capture`);
    }
}

export { coordToTileName, tileToPiece, pieceNameToPiece, clearSelection }