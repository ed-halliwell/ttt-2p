interface BoardTextProps {
  player1Turn: boolean;
  winner: number;
}

export default function BoardText(props: BoardTextProps): JSX.Element {
  if (props.winner === 2) return <h4>🎉 &nbsp;Noughts Win! &nbsp;🎉</h4>;
  else if (props.winner === 3) return <h4>🎉 &nbsp; Crosses Win! &nbsp; 🎉</h4>;
  else if (props.player1Turn) return <h4>🎮 &nbsp; Player 1's turn</h4>;
  else if (!props.player1Turn) return <h4>🎮 &nbsp; Player 2's turn</h4>;
  else return <h4>🤦 &nbsp;Oh no! Something went wrong!</h4>;
}
