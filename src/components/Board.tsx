import { useState } from "react";
import BoardText from "./BoardText";
import Square from "./Square";
import { checkCrossesWin, checkNoughtsWin } from "../utils/winConditions";
import "../styles/Board.css";

export default function Board(): JSX.Element {
  const [player1Turn, setPlayer1Turn] = useState<boolean>(true);
  const [noughtsWin, setNoughtsWin] = useState<boolean>(false);
  const [crossesWin, setCrossesWin] = useState<boolean>(false);
  const [board, setBoard] = useState<number[][]>([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);

  const createNewBoard = (): void => {
    setPlayer1Turn(true);
    setNoughtsWin(false);
    setCrossesWin(false);
    setBoard([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
  };

  const takeTurn = (coord: string) => {
    const [y, x] = coord.split("-").map(Number);

    function updateSquare(y: number, x: number): void {
      player1Turn ? (board[y][x] = 2) : (board[y][x] = 3);
    }
    updateSquare(y, x);

    setPlayer1Turn(!player1Turn);
    setNoughtsWin(checkNoughtsWin(board));
    setCrossesWin(checkCrossesWin(board));
  };

  const renderBoard = () => {
    const tblBoard = [];
    for (let y = 0; y < 3; y++) {
      const row = [];
      for (let x = 0; x < 3; x++) {
        const coord = `${y}-${x}`;
        row.push(
          <Square
            squareVal={board[y][x]}
            key={coord}
            takeTurn={() => takeTurn(coord)}
            disabled={board[y][x] !== 1}
          />
        );
      }
      tblBoard.push(<tr key={y}>{row}</tr>);
    }
    return tblBoard;
  };

  return (
    <div className="Board-container">
      <h1 className="Board-header">TicTacToe</h1>
      <div>
        <table className="Board">
          {(noughtsWin || crossesWin) && <div className="overlay"></div>}
          <tbody>{renderBoard()}</tbody>
        </table>
      </div>
      <BoardText
        player1Turn={player1Turn}
        noughtsWin={noughtsWin}
        crossesWin={crossesWin}
      />
      <button className="Board-reset" onClick={createNewBoard}>
        New Game
      </button>
    </div>
  );
}
