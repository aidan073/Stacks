import gameState from "./game-master.js";
import { coordToTile } from "./utils.js";
// Functions that affect the game state as it is being played

// Handle whenever a tile is clicked
function handleTileClick(piece){
    if(gameState.activity !== "moving") return;
    piece.mover(gameState);
}

// Place a piece onto a tile
function setPieceOnTile(piece, tile){
    tile.classList.add('has-piece');
    const image = document.createElement("img");
    image.src = `../imgs/pieces/${piece.name}.png`;
    image.id = piece.name;
    image.class = "piece-img";
    tile.appendChild(image);
}

// Remove a piece from a tile
function removePieceFromTile(piece, tile) {
    const pieceImg = tile.querySelector(`#${piece.name}`);
    if(pieceImg) {
        pieceImg.remove();
        if(!tile.querySelector(".piece-img")){
            tile.classList.remove('has-piece');
        }
    }
}

let isRolling = false;
function onDieClick(e, faces, onResult) {
    if(isRolling || gameState.activity !== "rolling") return;
    isRolling = true; // lock when already rolling

    let die = e.currentTarget;
    die.classList.add('die-rolling');
    die.addEventListener('animationend', function handler() {
        die.classList.remove('die-rolling');
        const finalNumber = Math.floor(Math.random() * faces);
        die.src = getDieFace(finalNumber);
        die.removeEventListener('animationend', handler);
        isRolling = false;
        onResult(finalNumber+1);
    });
}

// Return die face based on number
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
    if(gameState.turn === "red"){
        gameState.turn = "blue";
        document.getElementById("turn-announcer").innerHTML = `<span id=blue-turn-text>Blue's</span> turn.`;
        for(const piece of Object.values(gameState.blues)){
            document.getElementById(coordToTile(piece.coord)).addEventListener('click', () => handleTileClick(piece));
        }
        // make sure to destroy listeners after
    }
    else{
        gameState.turn = "red";
        document.getElementById("turn-announcer").innerHTML = `<span id=red-turn-text>Red's</span> turn.`;
        for(const piece of Object.values(gameState.reds)){
            document.getElementById(coordToTile(piece.coord)).addEventListener('click', () => handleTileClick(piece));
        }
    }
}

function rollDie(){
    gameState.activity = "rolling";
}

function movePiece(){
    gameState.activity = "moving";
}

export { handleTileClick, setPieceOnTile, removePieceFromTile, onDieClick, resetBoard, toggleTurn, rollDie, movePiece };