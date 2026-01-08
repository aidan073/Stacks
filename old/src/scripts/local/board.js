class Board{
    constructor(tiles, redPieces, bluePieces){
        this.boardElement;
        this.tiles = tiles;
        this.redPieces = redPieces;
        this.bluePieces = bluePieces;

        this.validMoveHandlers = new Map();
        this.pieceClickHandlers = new Map();
    }
}

export { Board }