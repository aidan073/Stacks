import { handleTileClick, pieceTypeToMover, resetBoard } from "./game-logic.js";

document.addEventListener('DOMContentLoaded', () => {
    class piece{
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
                tile.className = "tile";
                tile.id = `tile${boardSize*row+column}`;
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
            const thisPiece = new piece(k, v);
            redPieces[k] = thisPiece;
            const currTile = document.getElementById(coordToTile(v));
            displayPiece(thisPiece, currTile);
        };
        // Populate blues
        for(const [k, v] of Object.entries(blueSpawns)){
            const thisPiece = new piece(k, v);
            bluePieces[k] = thisPiece;
            const currTile = document.getElementById(coordToTile(v));
            displayPiece(thisPiece, currTile);
        };
    }

    // Create a piece from its name, and display onto a tile
    function displayPiece(piece, tile){
        const image = document.createElement("img");
        image.src = `../imgs/pieces/${piece.name}.png`;
        image.id = piece.name;
        image.class = "piece-img";
        tile.appendChild(image);
    }

    // Turn game on or off, and perform necessary logic + visual changes
    function setGameState(newState) {
        const gameOverlay = document.getElementById("game-overlay");
        if (newState === "off") {
            gameOverlay.classList.remove("hidden");
        } else {
            gameOverlay.classList.add("hidden");
        }
    }

    // When 'Play Game' is selected
    function onPlayGame(){
        setGameState("on");
    }

    let playButton = document.getElementById("play-button");
    playButton.addEventListener('click', (e) => onPlayGame());

    createBoard();
    setSpecialTiles();
    populateBoard();
});