document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById("board");
    const boardSize = 8; // changing this requires changing board styling currently

    function populateBoard(){
        for(let row = 0; row < boardSize; row++){
            for(let column = 0; column < boardSize; column++){
                const tile = document.createElement("div")
                tile.setAttribute('class', 'tile');
                tile.dataset.row = row;
                tile.dataset.column = column;
                tile.addEventListener('click', (e) => handleTileClick(e, row, column));
                board.appendChild(tile);
            }
        }
    }

    function handleTileClick(e, row, column){
        alert(`You clicked tile ${row}, ${column}`);
    }

    populateBoard();
});