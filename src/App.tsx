import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
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

const firebaseConfig = {
  apiKey: "AIzaSyCqGKpji6dP_UW7PrDv-w-7EMxJlZg5YVw",
  authDomain: "chat-app-89f55.firebaseapp.com",
  projectId: "chat-app-89f55",
  storageBucket: "chat-app-89f55.appspot.com",
  messagingSenderId: "308398097216",
  appId: "1:308398097216:web:2bb3f60054505f05a6f0a5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export default function App(): JSX.Element {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function ChatRoom(): JSX.Element {
  const [formValue, setFormValue] = useState("");
  // const messagesRef = doc(firestore, "messages"));
  // const query = messagesRef.orderBy("createdAt").limit(25);

  const querySnapshot = getDocs(collection(db, "messages"));
  const messages = querySnapshot;
  // .forEach((msg: any) => {
  //   console.log(msg.id, " => ", msg.data());
  // });

  // const [messages] = useCollectionData(query, { idField: "id" });

  const dummy: any = useRef();

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (auth.currentUser) {
      const { uid, photoURL } = auth.currentUser;
      // const newMessageRef =
      await addDoc(collection(db, "messages"), {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL,
      });
    }

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        <div>
          {/* {messages &&
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg.text} />
            ))} */}
        </div>
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

interface ChatMessageProps {
  message: { text: string; uid: string; photoURL: string };
}

function ChatMessage(props: ChatMessageProps): JSX.Element {
  const { text, uid, photoURL } = props.message;

  // const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  );
}
