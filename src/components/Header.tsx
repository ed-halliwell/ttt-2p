import { User } from "@firebase/auth";
import SignOut from "../components/SignOut";
import "../styles/Header.css";

interface HeaderProps {
  signedInUser: User | null | undefined;
}

export default function Header(props: HeaderProps) {
  return (
    <header>
      <h1 className="App-header">TicTacToe</h1>
      {props.signedInUser && <SignOut />}
    </header>
  );
}
