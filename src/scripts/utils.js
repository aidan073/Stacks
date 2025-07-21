// Convert [x,y] coord to tile id
const coordToTile = coord => `tile${coord[0]*window.boardSize+coord[1]}`;

function manhattan(rootCoord, roll, conditionalCallback, optionTag){
    for(let dx = -roll; dx <= roll; dx++) {
        for(let dy = -roll; dy <= roll; dy++) {
            const distance = Math.abs(dx) + Math.abs(dy);
            if(distance <= roll) {
                const targetX = rootCoord[0] + dx;
                const targetY = rootCoord[1] + dy;
                const tileId = coordToTile([targetX, targetY]);
                const currTile = document.getElementById(tileId);
                if(conditionalCallback(currTile)) {
                    currTile.classList.add(optionTag);
                }
            }
        }
    }
}

export { coordToTile, manhattan}