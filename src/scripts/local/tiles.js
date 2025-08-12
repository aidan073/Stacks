import gameState from "./game-master.js";
import { onPieceClick } from "./pieces.js";

class Tile{
    constructor(tileElement, row, column, idx, piece=null, specialTileType=null){
        this.tileElement = tileElement;
        this.row = row;
        this.column = column;
        this.idx = idx;
        this.piece = piece;
        this.specialTileType = specialTileType; // Luck, Risk, Draw, Bank
    }
}

// Convert [x,y] coord to tile idx
const coordToTileIdx = coord => {
    if(coord[0] < 0 || coord[1] < 0 || coord[0] >= window.boardSize || coord[1] >= window.boardSize) return;
    return coord[0]*window.boardSize+coord[1];
}

function onTileClick() {
    if(gameState.status === "off") return;
    if(gameState.activity !== "moving") return;
    const tileObj = gameState.tiles[parseInt(this.dataset.tileIdx, 10)];
    if(tileObj.piece) onPieceClick(tileObj.piece);
}

export { Tile, coordToTileIdx, onTileClick }
