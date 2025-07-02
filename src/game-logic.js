// Return mover for given piece type
function pieceTypeToMover(pieceType){
    switch(pieceType){
        case "num1":
        case "num2":
        case "num3":
        case "num4":
            return numericMover;

        case "brute":
            return bruteMover;
        
        case "ghost":
            return ghostMover;
    }
}

// Movers
function numericMover(piece){
    return;
}
function bruteMover(piece){
    return;
}
function ghostMover(piece){
    return;
}

// Dies
const six_die = document.getElementById('6die');
const four_die = document.getElementById('4die')

six_die.addEventListener('click', (e) => onDieClick(e, 6));
four_die.addEventListener('click', (e) => onDieClick(e, 4));

let isRolling = false;
function onDieClick(e, faces) {
    if(isRolling) return; // prevent re-entry
    isRolling = true;

    let die = e.currentTarget;
    die.style.transform = 'rotate(360deg)';

    for(let i = 0; i < 5; i++) {
        setTimeout(() => {
            const randomNumber = Math.floor(Math.random() * faces);
            die.textContent = getDieFace(randomNumber);
        }, i * 100);
    }

    setTimeout(() => {
        const finalNumber = Math.floor(Math.random() * faces);
        die.textContent = getDieFace(finalNumber);
        die.style.transform = 'rotate(0deg)';
        isRolling = false;
    }, 500);
}

// Return die face based on number
function getDieFace(number) {
  const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  return faces[number];
}

export { pieceTypeToMover };

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById("board");
});