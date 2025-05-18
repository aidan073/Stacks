document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById("board");
    const boardSize = 8; // changing this requires changing board styling currently
    const coordToTile = coord => `tile${coord[0]*boardSize+coord[1]}`;
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

    // Create tiles
    function createBoard(){
        for(let row = 0; row < boardSize; row++){
            for(let column = 0; column < boardSize; column++){
                const tile = document.createElement("div");
                tile.className = "tile";
                tile.id = `tile${boardSize*row+column}`;
                tile.dataset.row = row;
                tile.dataset.column = column;
                tile.addEventListener('click', (e) => handleTileClick(e, row, column));
                board.appendChild(tile);
            }
        }
    }

    // Initial board piece states
    function populateBoard(){
        // Populate reds
        for(const [k, v] of Object.entries(redSpawns)){
            const currTile = document.getElementById(coordToTile(v));
            displayPiece(currTile, k);
        };
        // Populate blues
        for(const [k, v] of Object.entries(blueSpawns)){
            const currTile = document.getElementById(coordToTile(v));
            displayPiece(currTile, k);
        };
    }

    // Display a piece onto a tile
    function displayPiece(tile, piece){
        const image = document.createElement("img");
        image.src = `../imgs/pieces/${piece}.png`;
        image.id = piece;
        tile.appendChild(image);
    }

    // Handle whenever a tile is clicked
    function handleTileClick(e, row, column){
        alert(`You clicked tile ${row}, ${column}`);
    }

    // Reset board back to initial state
    function resetBoard(){
        return;
    }

    createBoard();
    populateBoard();
});