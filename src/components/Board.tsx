import { useState, useEffect } from "react";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

import BoardText from "./BoardText";
import Square from "./Square";
import { checkCrossesWin, checkNoughtsWin } from "../utils/winConditions";
import "../styles/Board.css";

interface BoardProps {
  roomId: string;
  handleSetRoomId: (roomId: string) => void;
}

export default function Board(props: BoardProps): JSX.Element {
  const db = getFirestore();
  const [player1Turn, setPlayer1Turn] = useState<boolean>(true);
  const [noughtsWin, setNoughtsWin] = useState<boolean>(false);
  const [crossesWin, setCrossesWin] = useState<boolean>(false);
  const [board, setBoard] = useState<number[][]>([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log("UseEffect is firing...");
    const fetchData = async () => {
      const db = getFirestore();
      const roomRef = doc(db, "rooms", `${props.roomId}`);
      const snap = await getDoc(roomRef);
      const gameData = snap.data();
      setBoard(JSON.parse(gameData?.board));
    };
    fetchData();
  });

  // const createNewBoard = (): void => {
  //   setPlayer1Turn(true);
  //   setNoughtsWin(false);
  //   setCrossesWin(false);
  //   setBoard([
  //     [1, 1, 1],
  //     [1, 1, 1],
  //     [1, 1, 1],
  //   ]);
  // };

  const takeTurn = (coord: string) => {
    const [y, x] = coord.split("-").map(Number);

    function updateSquare(y: number, x: number): void {
      player1Turn ? (board[y][x] = 2) : (board[y][x] = 3);
    }
    updateSquare(y, x);

    setPlayer1Turn(!player1Turn);
    setNoughtsWin(checkNoughtsWin(board));
    setCrossesWin(checkCrossesWin(board));

    const updateBoardOnDb = async (gameBoard: number[][]) => {
      const stringifiedBoard = JSON.stringify(gameBoard);
      const roomRef = doc(db, "rooms", `${props.roomId}`);
      await updateDoc(roomRef, {
        board: stringifiedBoard,
      });
    };
    updateBoardOnDb(board);
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
      <div className="Board-text">
        <BoardText
          player1Turn={player1Turn}
          noughtsWin={noughtsWin}
          crossesWin={crossesWin}
        />
      </div>
      <table className="Board-table">
        {(noughtsWin || crossesWin) && <div className="overlay"></div>}
        <tbody>{renderBoard()}</tbody>
      </table>

      {/* <button className="Board-reset" onClick={createNewBoard}>
        New Game
      </button> */}
      <button className="Board-reset" onClick={() => props.handleSetRoomId("")}>
        Leave Room
      </button>
    </div>
  );
}
