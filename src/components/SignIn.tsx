import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import GoogleButton from "react-google-button";
const provider = new GoogleAuthProvider();

export default function SignIn(): JSX.Element {
  const signInWithGoogle = async () => {
    const auth = await getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <GoogleButton onClick={signInWithGoogle} className="sign-in" />
    </>
  );
}
