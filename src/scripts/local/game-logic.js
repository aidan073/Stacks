import { coordToTile, clearDots, tileToPiece } from "./game-utils.js";
import { Numeric, Ghost, Brute } from "./game-classes.js";

function manhattan(rootCoord, roll, conditionalCallback, currPlayer){
    for(let dx = -roll; dx <= roll; dx++) {
        for(let dy = -roll; dy <= roll; dy++) {
            const distance = Math.abs(dx) + Math.abs(dy);
            if(distance <= roll) {
                const targetX = rootCoord[0] + dx;
                const targetY = rootCoord[1] + dy;
                const tileId = coordToTile([targetX, targetY]);
                const currTile = document.getElementById(tileId);
                if(currTile) {
                    const moveCondition = conditionalCallback(currTile);
                    switch(moveCondition){
                        case 1:
                            currTile.classList.add("capture");
                        case 0:
                            currTile.classList.add(`${currPlayer}-dot`);
                    }
                }
            }
        }
    }
}

function mover(gameState) {
    if(this.isSelected){
        clearDots(gameState.turn);
        this.isSelected = false;
        return;
    }
    this.isSelected = true;
    const rootCoord = this.coord;
    const roll = gameState.fourDieVal;
    manhattan(rootCoord, roll, this.moveConditions, gameState.turn);
}

// Move conditionals
// Can move to tile conditionals: -1 = can't, 0 = can, 1 = capture

//TODO
function numericMoveConditions(currTile, currPlayer){
    const potentialPiece = tileToPiece[currTile];
    if(!currTile) return -1;
    if(typeof potentialPiece === Brute && potentialPiece.team !== currPlayer) return 1;
    return 0;
}

//TODO
function bruteMoveConditions(currTile, currPlayer){
    const potentialPiece = tileToPiece[currTile];
    if(!currTile) return -1;
    if(typeof potentialPiece === Brute && potentialPiece.team !== currPlayer) return 1;
    return 0;
}

function ghostMoveConditions(currTile, currPlayer){
    const potentialPiece = tileToPiece[currTile];
    if(!currTile) return -1;
    if(typeof potentialPiece === Brute && potentialPiece.team !== currPlayer) return 1;
    return 0;
}

export { mover, numericMoveConditions, bruteMoveConditions, ghostMoveConditions };