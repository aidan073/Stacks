import { Ghost } from "./pieces.js";
import { TurnEvents } from "./enums.js";
import gameState from "./game-master.js";
import { clearSelection } from "./game-effector.js";

class Tile{
    constructor(tileElement, row, column, idx, piece=null, specialTileType=null){
        this.tileElement = tileElement;
        this.piece = piece;
        this.row = row;
        this.column = column;
        this.idx = idx;
        this.specialTileType = specialTileType; // Luck, Risk, Draw, Bank
    }
}

// When a tile is a valid move and is clicked
function onValidMoveClick(piece, destinationTile){
    const capture = false;
    // Warning: this condition allows you to capture your own piece. However, your piece shouldn't be a valid move (except ghost).
    if(destinationTile.piece !== null && !(destinationTile.piece instanceof Ghost)){
        capture = true;
    }
    piece.setOnTile(destinationTile, capture);
    clearSelection();
    gameState.turnManager.dispatchEvent(new CustomEvent(TurnEvents.MAKE_MOVE_COMPLETE));
}

// Convert [x,y] coord to tile idx
const coordToTileIdx = coord => {
    if(coord[0] < 0 || coord[1] < 0 || coord[0] >= window.boardSize || coord[1] >= window.boardSize) return;
    return coord[0]*window.boardSize+coord[1];
}

export { Tile, coordToTileIdx, onValidMoveClick }
