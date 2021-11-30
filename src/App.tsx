import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
} from "firebase/firestore";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";

import { initializeApp } from "firebase/app";
import { useState } from "react";

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
const db = getFirestore();
const auth = getAuth();

export default function App(): JSX.Element {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      {!user && (
        <>
          <section className="SignInView">
            <header>
              <h1 className="AppTitle">TicTacToe</h1>
            </header>
            <SignIn />
            <footer>© Ed Halliwell, 2021</footer>
          </section>
        </>
      )}
      {user && (
        <>
          <section className="SignedInView">
            <header>
              <h1 className="AppTitle">TicTacToe</h1>
              <SignOut />
            </header>
            <Lobby />
            {/* <ChatRoom /> */}
          </section>
        </>
      )}
    </div>
  );
}

function Lobby(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);

  // List all the rooms
  const q = query(collection(db, "rooms"), orderBy("createdAt"), limit(25));
  const [rooms] = useCollectionData(q, { idField: "id" });

  const createNewRoom = async () => {
    const player1Name = prompt("What is your name?") || "";
    if (auth.currentUser) {
      const { uid } = auth.currentUser;
      await addDoc(collection(db, "rooms"), {
        player1: {
          id: uid,
          name: player1Name,
        },
        player2: {
          id: null,
          name: null,
        },
        createdAt: Math.round(new Date().getTime() / 1000),
        board: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      });
    }
  };

  const joinRoom = async () => {
    const roomId = prompt("Please enter a Room ID") || "";
    const player2Name = prompt("What is your name?") || "";

    setLoading(true);
    try {
      const roomRef = doc(db, "rooms", `${roomId}`);
      const snap = await getDoc(roomRef);
      if (snap.exists()) {
        console.log(snap.data());
      } else {
        console.log("No such document");
      }
      if (auth.currentUser) {
        const { uid } = auth.currentUser;
        await updateDoc(roomRef, {
          player2: {
            id: uid,
            name: player2Name,
          },
        });
      }
      console.log("You made it to joining a room", roomId);
    } catch (error) {
      console.log(error);
      alert("No such room! Please eneter a valid Room ID");
    }
    setLoading(false);
  };

  const enterRoom = (roomId: number) => {
    console.log("Entering:", roomId);
  };

  return (
    <>
      <button onClick={createNewRoom}>Create New Room</button>
      <button onClick={joinRoom}>Join Room</button>
      {loading && <p>Loading...</p>}
      {rooms?.map((room) => (
        <ul key={room.id}>
          <li>Room Id: {room.id}</li>
          <li>Player 1 Id: {room.player1.id}</li>
          <li>Player 1 Name: {room.player1.name}</li>
          <li>Player 2 Id: {room.player2.id}</li>
          <li>Player 2 Name: {room.player2.name}</li>
          <li>Created At: {room.createdAt}</li>
          <li>Room Board: {room.board}</li>
          <li>
            Link to Room:{" "}
            <button onClick={() => enterRoom(room.id)}>Enter Room</button>
          </li>
        </ul>
      ))}
      {/* <GameRoom room={rooms} /> */}
    </>
  );
}

interface GameRoomProps {
  rooms: {
    player1: string;
    player2: string;
    id: string;
    board: number[];
  };
}

function GameRoom(props: GameRoomProps): JSX.Element {
  return <h1>Game Room</h1>;
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
