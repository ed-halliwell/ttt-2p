import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";

import { initializeApp } from "firebase/app";
import { useState, useRef } from "react";

import "./App.css";

// TODOS
// Fix authentication rules in console - https://stackoverflow.com/questions/46590155/firestore-permission-denied-missing-or-insufficient-permissions

const firebaseConfig = {
  apiKey: "AIzaSyCqGKpji6dP_UW7PrDv-w-7EMxJlZg5YVw",
  authDomain: "chat-app-89f55.firebaseapp.com",
  projectId: "chat-app-89f55",
  storageBucket: "chat-app-89f55.appspot.com",
  messagingSenderId: "308398097216",
  appId: "1:308398097216:web:2bb3f60054505f05a6f0a5",
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
              <h1 className="AppTitle">CHAT!</h1>
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
              <h1 className="AppTitle">CHAT!</h1>
              <SignOut />
            </header>
            <ChatRoom />
          </section>
        </>
      )}
    </div>
  );
}

function ChatRoom(): JSX.Element {
  const [formValue, setFormValue] = useState("");

  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(25));
  const [messages] = useCollectionData(q, { idField: "id" });

  const dummy = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (auth.currentUser) {
      const { uid, photoURL } = auth.currentUser;
      await addDoc(collection(db, "messages"), {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL,
      });
    }

    setFormValue("");
    if (null !== dummy.current) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <main>
        <div>
          {messages &&
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                text={msg.text}
                photoURL={msg.photoURL}
                userId={msg.uid}
              />
            ))}
        </div>
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Write your message..."
        />
        <button type="submit" disabled={!formValue}>
          Send
        </button>
      </form>
    </>
  );
}

interface ChatMessageProps {
  text: string;
  userId: string;
  photoURL: string;
}

function ChatMessage(props: ChatMessageProps): JSX.Element {
  const { text, userId, photoURL } = props;

  return (
    <>
      {auth.currentUser && (
        <div
          className={`message ${
            userId === auth.currentUser.uid ? "sent" : "received"
          }`}
        >
          <img
            src={
              photoURL ||
              "https://api.adorable.io/avatars/23/abott@adorable.png"
            }
            alt={userId}
          />
          <p>{text}</p>
        </div>
      )}
    </>
  );
}
