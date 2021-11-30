import { useState } from "react";
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
import { useCollectionData } from "react-firebase-hooks/firestore";

import "../styles/Lobby.css";

interface LobbyProps {
  handleSetRoomId: (roomId: string) => void;
}

export default function Lobby(props: LobbyProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);

  const db = getFirestore();
  const auth = getAuth();

  // List all the rooms, will remove later
  const q = query(collection(db, "rooms"), orderBy("createdAt"), limit(25));
  const [rooms] = useCollectionData(q, { idField: "id" });

  const createNewRoom = async () => {
    const player1Name = prompt("What is your name?") || "";
    if (auth.currentUser) {
      const { uid } = auth.currentUser;
      const { id } = await addDoc(collection(db, "rooms"), {
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
      props.handleSetRoomId(id);
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
      //   console.log(error);
      alert("No such room! Please eneter a valid Room ID");
    }
    setLoading(false);
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
        </ul>
      ))}
    </>
  );
}
