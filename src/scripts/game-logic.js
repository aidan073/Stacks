import { manhattan, clearDots } from "./utils.js";

// Movers
function numericMover(gameState){
    return;
}
function bruteMover(gameState){
    return;
}
function ghostMover(gameState) {
    const optionTag = gameState.turn === "red" ? "optionR" : "optionB";
    if(this.isSelected){
        clearDots(optionTag);
        this.isSelected = false;
        return;
    }
    this.isSelected = true;
    const rootCoord = this.coord;
    const roll = gameState.fourDieVal;
    manhattan(rootCoord, roll, ghostMoverCallback, optionTag);
}
function ghostMoverCallback(currTile){
    if(!currTile) return false;
    return true;
}

export { numericMover, bruteMover, ghostMover };