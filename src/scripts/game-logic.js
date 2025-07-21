import { manhattan } from "./utils.js";

// Movers
function numericMover(gameState){
    return;
}
function bruteMover(gameState){
    return;
}
function ghostMover(gameState) {
    const rootCoord = this.coord;
    // const roll = gameState.fourDieVal;
    const roll = 3;
    const optionTag = gameState.turn === "red" ? "optionR" : "optionB";
    manhattan(rootCoord, roll, ghostMoverCallback, optionTag);
}
function ghostMoverCallback(currTile){
    if(!currTile) return false;
    return true;
}

export { numericMover, bruteMover, ghostMover };