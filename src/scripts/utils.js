// Convert [x,y] coord to tile id
const coordToTile = coord => `tile${coord[0]*window.boardSize+coord[1]}`;

export { coordToTile }