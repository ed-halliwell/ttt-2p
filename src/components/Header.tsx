import { User, getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import SignOut from "../components/SignOut";
import "../styles/Header.css";

interface HeaderProps {
  signedInUser: User | null | undefined;
}

export default function Header(props: HeaderProps): JSX.Element {
  const auth = getAuth();
  const [user] = useAuthState(auth);

  return (
    <header>
      <h1 className="App-header">TicTacToe</h1>

      <div className="LoginDetails">
        {user && (
          <p className="signedInAs-label">
            Signed in as: <strong>{user?.displayName}</strong>
          </p>
        )}

        {props.signedInUser && <SignOut />}
      </div>
    </header>
  );
}
