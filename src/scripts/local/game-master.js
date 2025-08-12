import { Tile, onTileClick, coordToTileIdx } from "./tiles.js"
import { pieceNameToPiece } from "./pieces.js";
import { setPieceOnTile, removePieceFromTile, resetBoard, toggleTurn, rollFourDie, movePiece } from "./game-effector.js";

const redPieces = {};
const bluePieces = {};
const tiles = [];
window.boardSize = 8;

// Master game state class with all necessary properties
class State{
    constructor(status, tiles, reds, blues){
        this.turn;
        this.activity; // waiting, rolling, moving, 
        this.sixDieVal;
        this.fourDieVal;
        this.status = status;
        this.reds = reds;
        this.blues = blues;
        this.tiles = tiles;
    }
}

const gameState = new State("off", tiles, redPieces, bluePieces);
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

// When 'Play Game' is selected
function onPlayGame(){
    setGameState("on");
    gameState.turn = Math.random() >= 0.5 ? "red" : "blue"; // The starting player will actually be the opposite of this outcome.
    gameLoop();
}

// Main game loop
async function gameLoop(){
    while(gameState.status !== "off"){
        toggleTurn();
        await rollFourDie();
        await movePiece();
        // await playAgain?
        break;
    }
    return;
}

// Create tiles
function createBoard(){
    for(let row = 0; row < window.boardSize; row++){
        for(let column = 0; column < window.boardSize; column++){
            // Create tile element
            const tileElement = document.createElement("div");
            tileElement.className = `tile ${(tiles.length+row) % 2 === 0 ? "tEven": "tOdd"}`;
            tileElement.dataset.tileIdx = tiles.length;
            board.appendChild(tileElement);
            tileElement.addEventListener('click', onTileClick);

            // Create tile obj
            const tileObj = new Tile(tileElement, row, column, tiles.length);
            tiles.push(tileObj);
        }
    }
}

// Set special tiles onto board
function setSpecialTiles(){
    for(const [k, v] of Object.entries(specialTiles)){
        v.forEach(coord => {
            // Update tile obj
            const currTile = tiles[coordToTileIdx(coord)];
            currTile.specialTileType = k;
            
            // Update tile element
            const tileElement = currTile.tileElement;
            tileElement.classList.add(k);
            tileElement.innerHTML = `<span class="tile-label">${k}</span>`;
        });
    }
}

// Populate board with pieces in their initial locations
function populateBoard(){
    // Populate reds
    for(const [k, v] of Object.entries(redSpawns)){
        const currTile = tiles[coordToTileIdx(v)];
        const thisPiece = pieceNameToPiece(k, currTile);
        redPieces[k] = thisPiece;
        setPieceOnTile(thisPiece, currTile);
    };
    // Populate blues
    for(const [k, v] of Object.entries(blueSpawns)){
        const currTile = tiles[coordToTileIdx(v)];
        const thisPiece = pieceNameToPiece(k, currTile);
        bluePieces[k] = thisPiece;
        setPieceOnTile(thisPiece, currTile);
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

document.addEventListener('DOMContentLoaded', () => {
    // Game initialization
    createBoard();
    setSpecialTiles();
    populateBoard();
    window.onbeforeunload = () => {return gameState.status === "on" ? '' : undefined}; // prevent user from refreshing an active game.

    // Play button
    const playButton = document.getElementById("play-button");
    playButton.addEventListener('click', (e) => onPlayGame());
});