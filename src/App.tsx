import { useState } from "react";
import { initializeApp } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import "firebase/firestore";
import { getAuth } from "firebase/auth";

import Header from "./components/Header";
import SignIn from "./components/SignIn";
import Lobby from "./components/Lobby";
import Board from "./components/Board";

import "./App.css";

const firebaseConfig = {
  apiKey: "AIzaSyCx5tseso8XBXY8w8UN4EWXdgTDGrDxTIs",
  authDomain: "tictactoe-2p-17979.firebaseapp.com",
  projectId: "tictactoe-2p-17979",
  storageBucket: "tictactoe-2p-17979.appspot.com",
  messagingSenderId: "825404441793",
  appId: "1:825404441793:web:c37e20f97f0787b9b08040",
};

initializeApp(firebaseConfig);
const auth = getAuth();

export default function App(): JSX.Element {
  const [user] = useAuthState(auth);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const setRoomId = (roomId: string): void => {
    setSelectedRoomId(roomId);
  };

  return (
    <div className="App">
      <Header signedInUser={user} />
      {!user && !selectedRoomId && (
        <section className="SignInView">
          <SignIn />
          <footer>© Ed Halliwell, 2021</footer>
        </section>
      )}

      {user && !selectedRoomId && (
        <section className="Lobby">
          <Lobby handleSetRoomId={setRoomId} />
        </section>
      )}

      {user && selectedRoomId && (
        <section className="GameRoomView">
          <Board roomId={selectedRoomId} handleSetRoomId={setRoomId} />
        </section>
      )}
    </div>
  );
}
