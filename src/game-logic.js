// Handle whenever a tile is clicked
function handleTileClick(e, reds, blues){
    const tile = e.currentTarget;
    const firstChild = tile.firstElementChild;
    if(!firstChild){
        return;
    }
    if(!(firstChild.class === "piece-img")){
        return;
    }
    let piece;
    const pieceName = tile.firstElementChild.id;
    if(reds[pieceName]){
        piece = reds[pieceName];
    }
    else{
        piece = blues[pieceName];
    }
    alert(`You clicked tile ${tile.dataset.row}, ${tile.dataset.column}. It contains: ${piece.type} for team ${piece.team}`);
}

// Return mover for given piece type
function pieceTypeToMover(pieceType){
    switch(pieceType){
        case "num1":
        case "num2":
        case "num3":
        case "num4":
            return numericMover;

        case "brute":
            return bruteMover;
        
        case "ghost":
            return ghostMover;
    }
}

// Movers
function numericMover(piece){
    return;
}
function bruteMover(piece){
    return;
}
function ghostMover(piece){
    return;
}

// Reset board back to initial state
function resetBoard(){
    return;
}   

export { handleTileClick, pieceTypeToMover, resetBoard};

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById("board");
});