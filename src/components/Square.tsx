import "../styles/Square.css";

interface Props {
  squareVal: number;
  takeTurn: (coord: string) => void;
  disabled: boolean;
}

export default function Square(props: Props): JSX.Element {
  const squareState = ["", "far fa-circle", "fas fa-times"];
  const classes = `${squareState[props.squareVal - 1]}`;
  return (
    <td>
      <button
        className="Square"
        onClick={(evt) => props.takeTurn(String(evt))}
        disabled={props.disabled}
      >
        <i className={classes} />
      </button>
    </td>
  );
}
