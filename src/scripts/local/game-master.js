import { Board } from "./board.js";
import { Status } from "./enums.js";
import TurnManager from "./turn-manager.js";
import { createPieceFromPieceName } from "./pieces.js";
import { resetBoard, toggleTurn } from "./game-effector.js";
import { Tile, coordToTileIdx } from "./tiles.js"

const tiles = [];
const redPieces = [];
const bluePieces = [];
window.boardSize = 8;

// Master game state class with all necessary properties
class State{
    constructor(status){
        this.status = status; // active or inactive
        this.phase; // e.g. rolling, moving
        this.board;
        this.currPlayer;
        this.sixDieVal = null;
        this.fourDieVal = null;
        this.turnManager = null;
    }
}

const gameState = new State(Status.Inactive);
gameState.board = new Board(tiles, redPieces, bluePieces)
export default gameState;

// Spawn mappings
const specialTiles = Object.freeze({
    Luck: [[0, 7]],
    Risk: [[0, 6], [1, 7]],
    Draw: [[5, 2]],
    Bank: [[7, 0]]
});
const redSpawns = Object.freeze({
    rBrute: [0, 0],
    rNumeric1: [0, 1],
    rNumeric2: [0, 2],
    rNumeric3: [0, 3],
    rNumeric4: [0, 4],
    rGhost: [0, 5]
});
const blueSpawns = Object.freeze({
    bBrute: [7, 7],
    bNumeric1: [6, 7],
    bNumeric2: [5, 7],
    bNumeric3: [4, 7],
    bNumeric4: [3, 7],
    bGhost: [2, 7]
});

// When 'Play Game' is selected
function onPlayGame(){
    setGameStatus(Status.Active);
    gameState.currPlayer = Math.random() >= 0.5 ? "red" : "blue"; // The starting player will actually be the opposite of this outcome.
    gameLoop();
}

// Main game loop
async function gameLoop(){
    const turnManager = new TurnManager(); 
    gameState.turnManager = turnManager;
    while(gameState.status === Status.Active){
        toggleTurn();
        await turnManager.rollFourDie();
        await turnManager.makeMove();
        // await postMovePiece();
        // await playAgain?
        // break;
    }
    return;
}

// Create tiles
function createBoard(){
    const board = document.getElementById("board");
    for(let row = 0; row < window.boardSize; row++){
        for(let column = 0; column < window.boardSize; column++){
            // Create tile element
            const tileElement = document.createElement("div");
            tileElement.className = `tile ${(tiles.length+row) % 2 === 0 ? "tEven": "tOdd"}`;
            tileElement.dataset.tileIdx = tiles.length;
            board.appendChild(tileElement);

            // Create tile obj
            const tile = new Tile(tileElement, row, column, tiles.length);
            tiles.push(tile);
        }
    }
    gameState.board.boardElement = board;
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
        const currtile = tiles[coordToTileIdx(v)];
        const thisPiece = createPieceFromPieceName(k, currtile);
        thisPiece.setOnTile(currtile);
        redPieces.push(thisPiece);
    };
    // Populate blues
    for(const [k, v] of Object.entries(blueSpawns)){
        const currtile = tiles[coordToTileIdx(v)];
        const thisPiece = createPieceFromPieceName(k, currtile);
        thisPiece.setOnTile(currtile);
        bluePieces.push(thisPiece);
    };
}

// Turn game on or off, and perform necessary logic + visual changes
function setGameStatus(newState) {
    const gameOverlay = document.getElementById("game-overlay");
    if (newState === Status.Inactive) {
        gameOverlay.classList.remove("hidden");
    } else {
        gameOverlay.classList.add("hidden");
    }
    gameState.status = newState;
}

document.addEventListener('DOMContentLoaded', () => {
    // Game initialization
    createBoard();
    setSpecialTiles();
    populateBoard();
    window.onbeforeunload = () => {return gameState.status === Status.Active ? '' : undefined}; // prevent user from refreshing an active game.

    // Play button
    const playButton = document.getElementById("play-button");
    playButton.addEventListener('click', (e) => onPlayGame());
});