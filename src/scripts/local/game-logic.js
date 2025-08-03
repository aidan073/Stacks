import { coordToTileName, clearDots, tileToPiece } from "./game-utils.js";
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
            console.log({ currTile, moveCondition });
            switch(moveCondition) {
                case 1:
                    currTile.classList.add("capture");
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
        clearDots(gameState.turn);
        this.isSelected = false;
        return;
    }
    this.isSelected = true;
    const rootCoord = this.coord;
    const roll = gameState.fourDieVal;
    findValidMoves(rootCoord, roll, this.moveConditions, gameState.turn);
}

// Move conditionals:
// -1 = can't, 0 = can, 1 = capture

//TODO
function numericMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    const potentialPiece = tileToPiece[currTile];
    if(potentialPiece instanceof Brute && potentialPiece.team !== currPlayer) return 1;
    return 0;
}

//TODO
function bruteMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    const potentialPiece = tileToPiece[currTile];
    if(potentialPiece instanceof Brute && potentialPiece.team !== currPlayer) return 1;
    return 0;
}

function ghostMoveConditions(currTile, currPlayer){
    if(!currTile) return -1;
    const potentialPiece = tileToPiece[currTile];
    if(potentialPiece instanceof Brute && potentialPiece.team !== currPlayer) return 1;
    return 0;
}

export { mover, numericMoveConditions, bruteMoveConditions, ghostMoveConditions };