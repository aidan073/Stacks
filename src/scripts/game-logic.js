import { coordToTile } from "./utils.js";

const board = document.getElementById("board");

// Movers
function numericMover(gameState){
    return;
}
function bruteMover(gameState){
    return;
}
function ghostMover(gameState) {
    const rootCoord = this.coord;
    const roll = gameState.fourDieVal;
    const optionTag = gameState.turn === "red" ? "optionR" : "optionB";

    for(let dx = -roll; dx <= roll; dx++) {
        for(let dy = -roll; dy <= roll; dy++) {
            const distance = Math.abs(dx) + Math.abs(dy);
            if(distance <= roll) {
                const targetX = rootCoord[0] + dx;
                const targetY = rootCoord[1] + dy;
                const tileId = coordToTile([targetX, targetY]);
                const currTile = document.getElementById(tileId);
                if(currTile) {
                    currTile.classList.add(optionTag);
                }
            }
        }
    }
}

export { numericMover, bruteMover, ghostMover };