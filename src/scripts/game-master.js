import { pieceTypeToMover } from "./game-logic.js";
import { handleTileClick, setPieceOnTile, removePieceFromTile, onDieClick, resetBoard } from "./game-effector.js";

document.addEventListener('DOMContentLoaded', () => {
    // Class to store all necessary game state properties
    class State{
        constructor(status, reds, blues){
            this.sixDieVal;
            this.fourDieVal;
            this.status = status;
            this.reds = reds;
            this.blues = blues;
        }
    }

    class Piece{
        constructor(pieceName, currCoord){
            this.name = pieceName;
            this.type = pieceNameToType(pieceName, typeMap);
            this.mover = pieceTypeToMover(this.type);
            this.coord = currCoord;
            if(pieceName[0] === "r"){
                this.team = "red";
            }
            else{
                this.team = "blue";
            }
        }
    }
    const redPieces = {};
    const bluePieces = {};
    const board = document.getElementById("board");
    const boardSize = 8; // changing this requires changing board styling currently
    const coordToTile = coord => `tile${coord[0]*boardSize+coord[1]}`;
    
    const specialTiles = {
        "Luck": [[0, 7]],
        "Risk": [[0, 6], [1, 7]],
        "Draw": [[5, 2]],
        "Bank": [[7, 0]]
    }
    // initial piece states
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
        "bNumeric1": [3, 7],
        "bNumeric2": [4, 7],
        "bNumeric3": [5, 7],
        "bNumeric4": [6, 7],
        "bGhost": [2, 7]
    }
    const typeMap = {
        "Brute": "brute",
        "Numeric1": "num1",
        "Numeric2": "num2",
        "Numeric3": "num3",
        "Numeric4": "num4",
        "Ghost": "ghost"
    };

    // Convert piece name to piece type
    function pieceNameToType(pieceName, typeMap) {
        // Strip the team prefix
        const baseName = pieceName.slice(1);
        const pieceType = typeMap[baseName];

        if (!pieceType) {
            throw new Error(`Piece with name: "${baseName}" does not exist in typeMap`);
        }
        return pieceType;
    }

    // Create tiles
    function createBoard(){
        for(let row = 0; row < boardSize; row++){
            for(let column = 0; column < boardSize; column++){
                const tile = document.createElement("div");
                let tileId = boardSize*row+column;
                tile.className = `tile ${(tileId+row) % 2 === 0 ? "tEven": "tOdd"}`;
                tile.id = `tile${tileId}`;
                tile.dataset.row = row;
                tile.dataset.column = column;
                tile.addEventListener('click', (e) => handleTileClick(e, redPieces, bluePieces));
                board.appendChild(tile);
            }
        }
    }

    // Set special tiles onto board
    function setSpecialTiles(){
        for(const [k, v] of Object.entries(specialTiles)){
            v.forEach(coord => {
                const currTile = document.getElementById(coordToTile(coord));
                currTile.classList.add(k);
                currTile.innerHTML = `<span class="tile-label">${k}</span>`;
            });
        }
    }

    // Populate board with pieces in their initial locations
    function populateBoard(){
        // Populate reds
        for(const [k, v] of Object.entries(redSpawns)){
            const thisPiece = new Piece(k, v);
            redPieces[k] = thisPiece;
            const currTile = document.getElementById(coordToTile(v));
            setPieceOnTile(thisPiece, currTile);
        };
        // Populate blues
        for(const [k, v] of Object.entries(blueSpawns)){
            const thisPiece = new Piece(k, v);
            bluePieces[k] = thisPiece;
            const currTile = document.getElementById(coordToTile(v));
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

    createBoard();
    setSpecialTiles();
    populateBoard();
    let gameState = new State("off", redPieces, bluePieces);
    window.onbeforeunload = () => {return gameState.status === "on" ? '' : undefined}; // prevent user from refreshing an active game.

    // When 'Play Game' is selected
    function onPlayGame(){
        setGameState("on");
    }

    let playButton = document.getElementById("play-button");
    playButton.addEventListener('click', (e) => onPlayGame());

    // Die value update callbacks
    function fourDieUpdate(newVal){
        gameState.fourDieVal = newVal;
    }
    function sixDieUpdate(newVal){
        gameState.sixDieVal = newVal;
    }
    
    const sixDie = document.getElementById('6die');
    const fourDie = document.getElementById('4die');
    sixDie.addEventListener('click', (e) => onDieClick(e, 6, sixDieUpdate));
    fourDie.addEventListener('click', (e) => onDieClick(e, 4, fourDieUpdate));

});