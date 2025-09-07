import { Phase, Status } from "./enums.js"; 
import gameState from "./game-master.js";
// Functions that affect the game state as it is being played

// Clear piece move selection
function clearSelection(){
    const validMoveHandlers = gameState.board.validMoveHandlers;
    for(const [tile, handler] of validMoveHandlers){
        tile.tileElement.removeEventListener("click", handler);
        validMoveHandlers.delete(tile);
        tile.tileElement.classList.remove(`${gameState.currPlayer}-dot`);
        tile.tileElement.classList.remove(`${gameState.currPlayer}-capture`);
    }
    let currPlayerPieces = null;
    if(gameState.currPlayer === "red"){
        currPlayerPieces = gameState.board.redPieces;
    }
    else{
        currPlayerPieces = gameState.board.bluePieces;
    }
    for(const piece of currPlayerPieces.values()){
        piece.isSelected = false;
    }
}

// When die is clicked (Use by turn-manager)
function onDieClick(e, faces, onResult) {
    const die = e.currentTarget;
    return new Promise((resolve) => {
        die.classList.add('die-rolling');
        die.addEventListener('animationend', function handler() {
            die.classList.remove('die-rolling');
            const finalNumber = Math.floor(Math.random() * faces);
            die.src = getDieFace(finalNumber);
            onResult(finalNumber+1);
            resolve();
        }, {once: true});
    });
}

// Return die face based on input index
function getDieFace(number) {
    const faces = ['one', 'two', 'three', 'four', 'five', 'six'];
    return `../imgs/dice/dice-six-faces-${faces[number]}.png`;
}

// Reset board back to initial state
function resetBoard(){
    return;
}   

// Turn flow functions
function toggleTurn(){
    if(gameState.currPlayer === "red"){
        gameState.currPlayer = "blue";
        document.getElementById("turn-announcer").innerHTML = `<span id=blue-turn-text>Blue's</span> turn.`;
    }
    else{
        gameState.currPlayer = "red";
        document.getElementById("turn-announcer").innerHTML = `<span id=red-turn-text>Red's</span> turn.`;
    }
}

export { onDieClick, resetBoard, toggleTurn, clearSelection };