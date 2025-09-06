import { TurnEvents } from "./enums.js";
import gameState from "./game-master.js";
import { coordToTileIdx, onValidMoveClick } from "./tiles.js";
import { clearSelection } from "./game-effector.js";

class Piece{
    constructor(pieceName, tile=null){
        this.name = pieceName;
        this.tile = tile;
        this.isSelected = false;
        this.team = pieceName[0] === "r" ? "red" : "blue";
    }
    mover() {
        const rootCoord = [this.tile.row, this.tile.column];
        const roll = gameState.fourDieVal;
        return findValidMoves(rootCoord, roll, this.moveConditions.bind(this), gameState.currPlayer);
    }

    // Place this piece onto a tile
    setOnTile(tile, capture=true){
        if(this.tile !== null){
            this._removeFromTile();
        }
        if(capture){
            capturePiece(tile.pieces);
        }
        tile.pieces.set(this, tile.pieces.keys().length);
        this.tile = tile;
        const tileElement = tile.tileElement;
        tileElement.classList.add('has-piece');
        const image = document.createElement("img");
        image.src = `../imgs/pieces/${this.name}.png`;
        image.id = this.name;
        image.class = "piece-img";
        tileElement.appendChild(image);
        return image.id;
    }

    // Remove this piece from its tile
    _removeFromTile() {
        this.tile.pieces.delete(this);
        const pieceImg = this.tile.tileElement.querySelector(`#${this.name}`);
        if(pieceImg) {
            pieceImg.remove();
            if(!this.tile.tileElement.querySelector(".piece-img")){
                this.tile.tileElement.classList.remove('has-piece');
            }
        }
        this.tile = null;
    }
}

class Numeric extends Piece{
    constructor(pieceName, tile, value){
        super(pieceName, tile);
        this.moveConditions = numericMoveConditions;
        this.value = value;
    }
}

class Ghost extends Piece{
    constructor(pieceName, tile){
        super(pieceName, tile);
        this.moveConditions = ghostMoveConditions;
    }
}

class Brute extends Piece{
    constructor(pieceName, tile){
        super(pieceName, tile);
        this.moveConditions = bruteMoveConditions;
    }
}

function findValidMoves(startCoord, roll, conditionalCallback, currPlayer) {
    const validMoveOptions = [];

    const queue = [
        [startCoord[0]+1, startCoord[1]],
        [startCoord[0]-1, startCoord[1]],
        [startCoord[0], startCoord[1]+1],
        [startCoord[0], startCoord[1]-1]
    ];
    const visited = new Set([
            startCoord.toString(),
            queue[0].toString(), 
            queue[1].toString(), 
            queue[2].toString(), 
            queue[3].toString()
        ]
    );
    const boarderDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while(roll > 0 && queue.length > 0) {
        const levelSize = queue.length;
        for(let i = 0; i < levelSize; i++) {
            const currCoord = queue.shift();
            const currTile = coordToTileIdx(currCoord) > gameState.board.tiles.length-1 ? undefined : gameState.board.tiles[coordToTileIdx(currCoord)];
            const moveCondition = conditionalCallback(currTile, currPlayer);
            switch(moveCondition) {
                case 1:
                    currTile.tileElement.classList.add(`${currPlayer}-capture`);
                    validMoveOptions.push(currTile);
                    break;
                case 0:
                    currTile.tileElement.classList.add(`${currPlayer}-dot`);
                    validMoveOptions.push(currTile);
                    if(roll > 1) {
                        for(const [dx, dy] of boarderDirections) {
                            const newCoord = [currCoord[0] + dx, currCoord[1] + dy];
                            const key = newCoord.toString();
                            if(!visited.has(key)) {
                                visited.add(key);
                                queue.push(newCoord);
                            }
                        }
                    }
                    break;
            }
        }
        roll--;
    }
    return validMoveOptions;
}

//TODO: SHOULDN'T BE ABLE TO TAKE PIECE IN SPAWN
// Move conditionals:
// -1 = can't, 0 = can, 1 = capture
function numericMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    if(currTile.pieces.size === 0) return 0;
    const pieceArr = [...currTile.pieces.keys()]
    if(pieceArr.every(piece => piece instanceof Ghost)) return 0;
    if(pieceArr.some(piece => piece instanceof Numeric && piece.team !== currPlayer && this.value > piece.value)) return 1;
    return -1;
}

function bruteMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    if(currTile.pieces.size === 0) return 0;
    const pieceArr = [...currTile.pieces.keys()]
    if(pieceArr.some(piece => piece instanceof Numeric && piece.team !== currPlayer)) return 1;
    return -1;
}

function ghostMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    const pieceArr = [...currTile.pieces.keys()]
    if(pieceArr.some(piece => piece instanceof Brute && piece.team !== currPlayer)) return 1;
    return 0;
}

// Create a Piece instance from a pieceName (see redSpawns, blueSpawns for pieceNames)
function createPieceFromPieceName(pieceName, tile){
    switch(pieceName[1]){
        case "N":
            return new Numeric(pieceName, tile, parseInt(pieceName[pieceName.length-1]));
        case "G":
            return new Ghost(pieceName, tile);
        case "B":
            return new Brute(pieceName, tile);
    }
}

// Event handler for tiles containing the current player's piece
function onSelfPieceClick(piece){
    if(piece.isSelected){
        clearSelection();
        return;
    }
    clearSelection();
    piece.isSelected = true;
    const validMoveOptions = piece.mover();
    validMoveOptions.forEach((tile) => {
        const handler = () => onValidMoveClick(piece, tile)
        tile.tileElement.addEventListener("click", handler)
        gameState.board.validMoveHandlers.set(tile, handler);
    });
}

// Capture the input piece
function capturePiece(piece){
    return;
}

export { createPieceFromPieceName, onSelfPieceClick, Ghost }