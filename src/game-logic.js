// Handle whenever a tile is clicked
function handleTileClick(e, row, column){
    alert(`You clicked tile ${row}, ${column}`);
}

// Reset board back to initial state
function resetBoard(){
    return;
}   

export { handleTileClick, resetBoard };

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById("board");
});