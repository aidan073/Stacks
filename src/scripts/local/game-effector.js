import { Phase } from "./enums.js"; 
import gameState from "./game-master.js";
// Functions that affect the game state as it is being played

// Clear piece move selection
function clearSelection(currPlayer){
    const tiles = gameState.tiles;
    for(const tile of tiles){
        const potentialPiece = tile.piece;
        if(potentialPiece && potentialPiece.team === currPlayer) potentialPiece.isSelected = false;
        tile.tileElement.classList.remove(`${currPlayer}-dot`);
        tile.tileElement.classList.remove(`${currPlayer}-capture`);
    }
}

// Place a piece onto a tile
function setPieceOnTile(piece, tile){
    tile.piece = piece;
    const tileElement = tile.tileElement;
    tileElement.classList.add('has-piece');
    const image = document.createElement("img");
    image.src = `../imgs/pieces/${piece.name}.png`;
    image.id = piece.name;
    image.class = "piece-img";
    tileElement.appendChild(image);
    return image.id;
}

// Remove a piece from a tile
function removePieceFromTile(piece, tile) {
    delete tileToPiece.tile.id;
    const pieceImg = tile.querySelector(`#${piece.name}`);
    if(pieceImg) {
        pieceImg.remove();
        if(!tile.querySelector(".piece-img")){
            tile.classList.remove('has-piece');
        }
    }
}

// Die value update callbacks
function fourDieUpdate(newVal){
    gameState.fourDieVal = newVal;
}
function sixDieUpdate(newVal){
    gameState.sixDieVal = newVal;
}

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

async function rollFourDie() {
    gameState.phase = Phase.Rolling;
    document.getElementById("instruction").innerText = "Please roll the 4 sided die.";

    const die = document.getElementById('4die');
    const faces = 4;
    await new Promise((resolve) => {
        die.addEventListener('click', async function handler(e) {
            await onDieClick(e, faces, fourDieUpdate);
            resolve();
        }, {once: true});
    });
}

function movePiece(){
    gameState.phase = Phase.Moving;

    // TODO: Make sure after moving a piece, that piece.isSelected is set to false.
}

export { setPieceOnTile, removePieceFromTile, onDieClick, resetBoard, toggleTurn, rollFourDie, movePiece, clearSelection};