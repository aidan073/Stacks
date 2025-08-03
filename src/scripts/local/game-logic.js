import { coordToTileName, clearSelection, tileToPiece } from "./game-utils.js";
import { Numeric, Ghost, Brute } from "./game-classes.js";

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
            const currTile = document.getElementById(coordToTileName(currCoord));
            const moveCondition = conditionalCallback(currTile, currPlayer);
            switch(moveCondition) {
                case 1:
                    currTile.classList.add(`${currPlayer}-capture`);
                    break;
                case 0:
                    currTile.classList.add(`${currPlayer}-dot`);
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

function mover(gameState) {
    if(this.isSelected){
        clearSelection(gameState.turn);
        return;
    }
    clearSelection(gameState.turn);
    this.isSelected = true;
    const rootCoord = this.coord;
    const roll = gameState.fourDieVal;
    findValidMoves(rootCoord, roll, this.moveConditions.bind(this), gameState.turn);
}

//TODO: SHOULDN'T BE ABLE TO TAKE PIECE IN SPAWN
// Move conditionals:
// -1 = can't, 0 = can, 1 = capture
function numericMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    const potentialPiece = tileToPiece[currTile.id];
    if(!potentialPiece || potentialPiece instanceof Ghost) return 0;
    if(potentialPiece instanceof Numeric && potentialPiece.team !== currPlayer && this.value > potentialPiece.value) return 1;
    return -1;
}

function bruteMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    const potentialPiece = tileToPiece[currTile.id];
    if(!potentialPiece) return 0;
    if(potentialPiece instanceof Numeric && potentialPiece.team !== currPlayer) return 1;
    return -1;
}

function ghostMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    const potentialPiece = tileToPiece[currTile.id];
    if(potentialPiece instanceof Brute && potentialPiece.team !== currPlayer) return 1;
    return 0;
}

export { mover, numericMoveConditions, bruteMoveConditions, ghostMoveConditions };