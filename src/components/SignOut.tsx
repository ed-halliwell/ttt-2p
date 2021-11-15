import { getAuth } from "firebase/auth";

export default function SignOut(): JSX.Element {
  const auth = getAuth();
  if (auth.currentUser) {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
  } else {
    return <div></div>;
  }
}
