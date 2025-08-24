import gameState from "./game-master.js";
import { coordToTileIdx } from "./tiles.js";
import { clearSelection } from "./game-effector.js";

class Piece{
    constructor(pieceName, tile=null){
        this.name = pieceName;
        this.tile = tile;
        this.isSelected = false;
        this.team = pieceName[0] === "r" ? "red" : "blue";
    }
    mover() {
        if(this.isSelected){
            clearSelection(gameState.currPlayer);
            return;
        }
        clearSelection(gameState.currPlayer);
        this.isSelected = true;
        const rootCoord = [this.tile.row, this.tile.column];
        const roll = gameState.fourDieVal;
        findValidMoves(rootCoord, roll, this.moveConditions.bind(this), gameState.currPlayer);
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
            const currTile = coordToTileIdx(currCoord) > gameState.tiles.length-1 ? undefined : gameState.tiles[coordToTileIdx(currCoord)];
            const moveCondition = conditionalCallback(currTile, currPlayer);
            switch(moveCondition) {
                case 1:
                    currTile.tileElement.classList.add(`${currPlayer}-capture`);
                    break;
                case 0:
                    currTile.tileElement.classList.add(`${currPlayer}-dot`);
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
}

//TODO: SHOULDN'T BE ABLE TO TAKE PIECE IN SPAWN
// Move conditionals:
// -1 = can't, 0 = can, 1 = capture
function numericMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    const potentialPiece = currTile.piece;
    if(!potentialPiece || potentialPiece instanceof Ghost) return 0;
    if(potentialPiece instanceof Numeric && potentialPiece.team !== currPlayer && this.value > potentialPiece.value) return 1;
    return -1;
}

function bruteMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    const potentialPiece = currTile.piece;
    if(!potentialPiece) return 0;
    if(potentialPiece instanceof Numeric && potentialPiece.team !== currPlayer) return 1;
    return -1;
}

function ghostMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    const potentialPiece = currTile.piece;
    if(potentialPiece instanceof Brute && potentialPiece.team !== currPlayer) return 1;
    return 0;
}

// Convert the name (see redSpawns, blueSpawns) of a piece to an actual Piece object
function pieceNameToPiece(pieceName, tile){
    switch(pieceName[1]){
        case "N":
            return new Numeric(pieceName, tile, parseInt(pieceName[pieceName.length-1]));
        case "G":
            return new Ghost(pieceName, tile);
        case "B":
            return new Brute(pieceName, tile);
    }
}

// Event handler for tiles containing the current player's piece ("this" refers to the tile)
function onSelfPieceClick(piece){
    if(piece.tile.tileElement.classList.contains(`${gameState.currPlayer}-capture`)){
        // capture a piece
        return;
    }
    piece.mover();
}

// Event handler for tiles containing the enemy player's piece ("this" refers to the tile)
function onEnemyPieceClick(piece){
    if(piece.tile.tileElement.classList.contains(`${gameState.currPlayer}-capture`)){
        // capture a piece
        return;
    }
}

export { pieceNameToPiece, onSelfPieceClick, onEnemyPieceClick }