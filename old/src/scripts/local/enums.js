export const Phase = Object.freeze({
  Waiting: "waiting",
  Rolling: "rolling",
  Moving: "moving"
});

export const Status = Object.freeze({
  Active: "active",
  Inactive: "inactive"
});

export const TurnEvents = Object.freeze({
  FOUR_DIE_ROLL_COMPLETE: 'fourDieRollComplete',
  PIECE_SELECTED: 'pieceSelected',
  MAKE_MOVE_COMPLETE: 'makeMoveComplete',
  POST_MOVE_COMPLETE: 'postMoveComplete',
});