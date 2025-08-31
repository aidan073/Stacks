import gameState from "./game-master.js";
import { onDieClick } from "./game-effector.js";
import { TurnEvents, Status, Phase } from "./enums.js";
import { onSelfPieceClick } from "./pieces.js";

// Manager that houses each step of the turn flow

// INFO //
// The base functions (e.g. rollFourDie) simply update the current phase,
// instructions, and other preliminary details, and attach an event listener
// that waits for the phase to be resolved. That actors (e.g. _rollFourDieActor)
// actually perform the turn events, and eventually dispatch a phase end event

class TurnManager extends EventTarget {
    constructor() {
        super();
    }

    rollFourDie() {
        if(gameState.status !== Status.Active) return;
        gameState.phase = Phase.Rolling;
        document.getElementById("instruction").innerText = "Please roll the 4 sided die.";
       
        const promise = new Promise((resolve) => {
            this.addEventListener(TurnEvents.FOUR_DIE_ROLL_COMPLETE, () => {
                resolve();
            }, { once: true });
        });
        
        this._rollFourDieActor()
        return promise;
    }

    async _rollFourDieActor() {
        const die = document.getElementById('4die');
        const faces = 4;
        await new Promise((resolve) => {
            die.addEventListener('click', async function handler(e) {
                await onDieClick(e, faces, (newVal) => {
                    gameState.fourDieVal = newVal;
                });
                resolve();
            }, { once: true });
        });
        this.dispatchEvent(new CustomEvent(TurnEvents.FOUR_DIE_ROLL_COMPLETE));
    }

    makeMove() {
        if(gameState.status !== Status.Active) return;
        gameState.phase = Phase.Moving;
        document.getElementById("instruction").innerText = "Make a move.";

        const promise = new Promise((resolve) => {
            this.addEventListener(TurnEvents.MAKE_MOVE_COMPLETE, () => {
                // Remove listeners from the current players pieces
                const pieceClickHandlers = gameState.board.pieceClickHandlers;
                for(const [piece, handler] of pieceClickHandlers){
                    piece.tile.tileElement.removeEventListener("click", handler);
                }
                pieceClickHandlers.clear();
                resolve();
            }, { once: true });
        });

        this._makeMoveActor();
        return promise;
    }

    async _makeMoveActor() {
        if(gameState.currPlayer === "red"){
            gameState.board.redPieces.forEach((currPiece) => {
                const handler = () => onSelfPieceClick(currPiece);
                currPiece.tile.tileElement.addEventListener("click", handler);
                gameState.board.pieceClickHandlers.set(currPiece, handler);
            });
        }
        else{
            gameState.board.bluePieces.forEach((currPiece) => {
                const handler = () => onSelfPieceClick(currPiece);
                currPiece.tile.tileElement.addEventListener("click", handler);
                gameState.board.pieceClickHandlers.set(currPiece, handler);
            });
        }
        return;
    }

    postMove() {
        return new Promise((resolve) => {
            this.addEventListener(TurnEvents.POST_MOVE_COMPLETE, (e) => {
                resolve(e.detail);
            }, { once: true });
        });
    }
}

export default TurnManager;