import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import BoardText from "./BoardText";
import Square from "./Square";
import { checkCrossesWin, checkNoughtsWin } from "../utils/winConditions";
import "../styles/Board.css";

interface BoardProps {
  roomId: string;
  handleSetRoomId: (roomId: string) => void;
}

export default function Board(props: BoardProps): JSX.Element {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const currentUserId = user ? user.uid : null;

  // Fetching game data from server
  const db = getFirestore();
  const [value] = useDocument(doc(db, "rooms", `${props.roomId}`));
  const roomData = value?.data();
  const board = roomData
    ? JSON.parse(roomData?.board)
    : [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ];
  const player1Turn = roomData?.player1Turn;
  const winner = roomData?.winner;

  const updateBoardOnDb = async (gameBoard: number[][]) => {
    await updateDoc(doc(db, "rooms", `${props.roomId}`), {
      board: JSON.stringify(gameBoard),
    });
  };

  const updatePlayerTurnOnDb = async (player1Turn: boolean) => {
    await updateDoc(doc(db, "rooms", `${props.roomId}`), {
      player1Turn: player1Turn,
    });
  };

  const updateWinnerOnDb = async (winnerValue: number) => {
    if (winnerValue === 2) {
      await updateDoc(doc(db, "rooms", `${props.roomId}`), {
        winner: 2, // noughts are 2
      });
    } else if (winnerValue === 3) {
      await updateDoc(doc(db, "rooms", `${props.roomId}`), {
        winner: 3, // crosses are 3
      });
    }
  };

  const takeTurn = (coord: string) => {
    const [y, x] = coord.split("-").map(Number);

    function updateSquare(y: number, x: number): void {
      player1Turn ? (board[y][x] = 2) : (board[y][x] = 3);
    }
    updateSquare(y, x);
    updatePlayerTurnOnDb(!player1Turn);

    if (checkNoughtsWin(board)) {
      updateWinnerOnDb(2);
    }
    if (checkCrossesWin(board)) {
      updateWinnerOnDb(3);
    }

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

  const createNewBoard = (): void => {
    updatePlayerTurnOnDb(true);
    updateWinnerOnDb(1);
    updateBoardOnDb([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
  };

  const iAmPlayer1 = currentUserId === roomData?.player1.id;
  const iAmPlayer2 = currentUserId === roomData?.player2.id;
  console.log(value);
  return (
    <div className="Board-container">
      <div className="Board-text">
        <strong>Room ID:</strong> {value?.id}
      </div>
      <div className="Board-text-helper">
        <em> ^ Copy this ID and share with your friend!</em>
      </div>
      <div className="Board-text">
        <BoardText player1Turn={player1Turn} winner={winner} />
      </div>
      {iAmPlayer1 && !player1Turn && <div className="overlay"></div>}
      {iAmPlayer2 && player1Turn && <div className="overlay"></div>}
      {(winner === 2 || winner === 3) && <div className="overlay"></div>}
      <table className="Board-table">
        <tbody>{renderBoard()}</tbody>
      </table>
      <button className="Board-button" onClick={createNewBoard}>
        New Game
      </button>
      <button
        className="Board-button"
        onClick={() => props.handleSetRoomId("")}
      >
        Leave Room
      </button>
    </div>
  );
}
