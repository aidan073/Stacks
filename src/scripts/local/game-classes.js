import { mover, numericMoveConditions, ghostMoveConditions, bruteMoveConditions } from "./game-logic.js";

class Piece{
    constructor(pieceName, currCoord){
        this.clickHandler;
        this.mover = mover;
        this.name = pieceName;
        this.coord = currCoord;
        this.isSelected = false;
        this.team = pieceName[0] === "r" ? "red" : "blue";
    }
}

class Numeric extends Piece{
    constructor(pieceName, currCoord, value){
        super(pieceName, currCoord);
        this.moveConditions = numericMoveConditions;
        this.value = value;
    }
}

class Ghost extends Piece{
    constructor(pieceName, currCoord){
        super(pieceName, currCoord);
        this.moveConditions = ghostMoveConditions;
    }
}

class Brute extends Piece{
    constructor(pieceName, currCoord){
        super(pieceName, currCoord);
        this.moveConditions = bruteMoveConditions;
    }
}

export { Numeric, Ghost, Brute }