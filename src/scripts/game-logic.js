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

export { pieceTypeToMover };