import { coordToTileName, pieceNameToPiece } from "./game-utils.js"
import { handlePieceClick, setPieceOnTile, removePieceFromTile, onDieClick, resetBoard, toggleTurn, rollFourDie, movePiece } from "./game-effector.js";

const redPieces = {};
const bluePieces = {};
window.boardSize = 8;

// Class to store all necessary game state properties
class State{
    constructor(status, reds, blues){
        this.turn;
        this.activity; // waiting, rolling, moving, 
        this.sixDieVal;
        this.fourDieVal;
        this.status = status;
        this.reds = reds;
        this.blues = blues;
    }
}

const gameState = new State("off", undefined, undefined);
export default gameState;

// Spawn mappings
const specialTiles = {
    "Luck": [[0, 7]],
    "Risk": [[0, 6], [1, 7]],
    "Draw": [[5, 2]],
    "Bank": [[7, 0]]
}
const redSpawns = {
    "rBrute": [0, 0],
    "rNumeric1": [0, 1],
    "rNumeric2": [0, 2],
    "rNumeric3": [0, 3],
    "rNumeric4": [0, 4],
    "rGhost": [0, 5]
}
const blueSpawns = {
    "bBrute": [7, 7],
    "bNumeric1": [6, 7],
    "bNumeric2": [5, 7],
    "bNumeric3": [4, 7],
    "bNumeric4": [3, 7],
    "bGhost": [2, 7]
}

// Create tiles
function createBoard(){
    for(let row = 0; row < window.boardSize; row++){
        for(let column = 0; column < window.boardSize; column++){
            const tile = document.createElement("div");
            let tileId = window.boardSize*row+column;
            tile.className = `tile ${(tileId+row) % 2 === 0 ? "tEven": "tOdd"}`;
            tile.id = `tile${tileId}`;
            tile.dataset.row = row;
            tile.dataset.column = column;
            board.appendChild(tile);
        }
    }
}

// Set special tiles onto board
function setSpecialTiles(){
    for(const [k, v] of Object.entries(specialTiles)){
        v.forEach(coord => {
            const currTile = document.getElementById(coordToTileName(coord));
            currTile.classList.add(k);
            currTile.innerHTML = `<span class="tile-label">${k}</span>`;
        });
    }
}

// Populate board with pieces in their initial locations
function populateBoard(){
    // Populate reds
    for(const [k, v] of Object.entries(redSpawns)){
        const thisPiece = pieceNameToPiece(k, v);
        redPieces[k] = thisPiece;
        const currTile = document.getElementById(coordToTileName(v));
        const htmlPieceId = setPieceOnTile(thisPiece, currTile);
        thisPiece.clickHandler = () => handlePieceClick(thisPiece);
        document.getElementById(htmlPieceId).addEventListener('click', thisPiece.clickHandler);
    };
    // Populate blues
    for(const [k, v] of Object.entries(blueSpawns)){
        const thisPiece = pieceNameToPiece(k, v);
        bluePieces[k] = thisPiece;
        const currTile = document.getElementById(coordToTileName(v));
        const htmlPieceId = setPieceOnTile(thisPiece, currTile);
        thisPiece.clickHandler = () => handlePieceClick(thisPiece);
        document.getElementById(htmlPieceId).addEventListener('click', thisPiece.clickHandler);
    };
}

// Turn game on or off, and perform necessary logic + visual changes
function setGameState(newState) {
    const gameOverlay = document.getElementById("game-overlay");
    if (newState === "off") {
        gameState.status = "off";
        gameOverlay.classList.remove("hidden");
    } else {
        gameState.status = "on";
        gameOverlay.classList.add("hidden");
    }
}

// When 'Play Game' is selected
function onPlayGame(){
    setGameState("on");
    gameState.turn = Math.random() >= 0.5 ? "red" : "blue"; // The starting player will actually be the opposite of this outcome.
    gameLoop();
}

async function gameLoop(){
    while(gameState.status != "off"){
        toggleTurn();
        await rollFourDie();
        movePiece();
        break;
    }
    return;
}

document.addEventListener('DOMContentLoaded', () => {
    // Game initialization
    createBoard();
    setSpecialTiles();
    populateBoard();
    gameState.reds = redPieces;
    gameState.blues = bluePieces;
    window.onbeforeunload = () => {return gameState.status === "on" ? '' : undefined}; // prevent user from refreshing an active game.

    // Play button
    let playButton = document.getElementById("play-button");
    playButton.addEventListener('click', (e) => onPlayGame());
});