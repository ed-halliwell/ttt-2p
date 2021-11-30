export function checkNoughtsWin(board: number[][]): boolean {
  if (
    (board[0][0] === 2 && board[0][1] === 2 && board[0][2] === 2) ||
    (board[1][0] === 2 && board[1][1] === 2 && board[1][2] === 2) ||
    (board[2][0] === 2 && board[2][1] === 2 && board[2][2] === 2) ||
    (board[0][0] === 2 && board[1][0] === 2 && board[2][0] === 2) ||
    (board[0][1] === 2 && board[1][1] === 2 && board[2][1] === 2) ||
    (board[0][2] === 2 && board[1][2] === 2 && board[2][2] === 2) ||
    (board[0][0] === 2 && board[1][1] === 2 && board[2][2] === 2) ||
    (board[0][2] === 2 && board[1][1] === 2 && board[2][0] === 2)
  ) {
    return true;
  } else {
    return false;
  }
}

export function checkCrossesWin(board: number[][]): boolean {
  if (
    (board[0][0] === 3 && board[0][1] === 3 && board[0][2] === 3) ||
    (board[1][0] === 3 && board[1][1] === 3 && board[1][2] === 3) ||
    (board[2][0] === 3 && board[2][1] === 3 && board[2][2] === 3) ||
    (board[0][0] === 3 && board[1][0] === 3 && board[2][0] === 3) ||
    (board[0][1] === 3 && board[1][1] === 3 && board[2][1] === 3) ||
    (board[0][2] === 3 && board[1][2] === 3 && board[2][2] === 3) ||
    (board[0][0] === 3 && board[1][1] === 3 && board[2][2] === 3) ||
    (board[0][2] === 3 && board[1][1] === 3 && board[2][0] === 3)
  ) {
    return true;
  } else {
    return false;
  }
}
