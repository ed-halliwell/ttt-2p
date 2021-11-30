import { useState } from "react";
import { initializeApp } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import "firebase/firestore";
import { getAuth } from "firebase/auth";

import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
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
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    "lfabqdaue1GjgHNfpsUS"
  );

  const setRoomId = (roomId: string): void => {
    setSelectedRoomId(roomId);
  };

  console.log(selectedRoomId);

  return (
    <div className="App">
      {!user && selectedRoomId === "" && (
        <section className="SignInView">
          <header>
            <h1 className="AppTitle">TicTacToe</h1>
          </header>
          <SignIn />
          <footer>© Ed Halliwell, 2021</footer>
        </section>
      )}
      {user && selectedRoomId === "" && (
        <section className="SignedInView">
          <header>
            <h1 className="AppTitle">TicTacToe</h1>
            <SignOut />
          </header>
          <Lobby handleSetRoomId={setRoomId} />
        </section>
      )}
      {user && selectedRoomId && (
        <section className="SignedInView">
          <header>
            <h1 className="AppTitle">TicTacToe</h1>
            <SignOut />
          </header>
          Game Room will go here {selectedRoomId}
          <Board />
        </section>
      )}
    </div>
  );
}

// function ChatRoom(): JSX.Element {
//   const [formValue, setFormValue] = useState("");

//   const messagesRef = collection(db, "messages");
//   const q = query(messagesRef, orderBy("createdAt"), limit(25));
//   const [messages] = useCollectionData(q, { idField: "id" });

//   const dummy = useRef<HTMLDivElement>(null);

//   const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (auth.currentUser) {
//       const { uid, photoURL } = auth.currentUser;
//       await addDoc(collection(db, "messages"), {
//         text: formValue,
//         createdAt: serverTimestamp(),
//         uid,
//         photoURL,
//       });
//     }

//     setFormValue("");
//     if (null !== dummy.current) {
//       dummy.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (
//     <>
//       <main>
//         <div>
//           {messages &&
//             messages.map((msg) => (
//               <ChatMessage
//                 key={msg.id}
//                 text={msg.text}
//                 photoURL={msg.photoURL}
//                 userId={msg.uid}
//               />
//             ))}
//         </div>
//         <div ref={dummy}></div>
//       </main>
//       <form onSubmit={sendMessage}>
//         <input
//           value={formValue}
//           onChange={(e) => setFormValue(e.target.value)}
//           placeholder="Write your message..."
//         />
//         <button type="submit" disabled={!formValue}>
//           Send
//         </button>
//       </form>
//     </>
//   );
// }

// interface ChatMessageProps {
//   text: string;
//   userId: string;
//   photoURL: string;
// }

// function ChatMessage(props: ChatMessageProps): JSX.Element {
//   const { text, userId, photoURL } = props;

//   return (
//     <>
//       {auth.currentUser && (
//         <div
//           className={`message ${
//             userId === auth.currentUser.uid ? "sent" : "received"
//           }`}
//         >
//           <img
//             src={
//               photoURL ||
//               "https://api.adorable.io/avatars/23/abott@adorable.png"
//             }
//             alt={userId}
//           />
//           <p>{text}</p>
//         </div>
//       )}
//     </>
//   );
// }
