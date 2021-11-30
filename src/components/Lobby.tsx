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
  const db = getFirestore();
  const auth = getAuth();

  // List all the rooms, will remove later
  const q = query(collection(db, "rooms"), orderBy("createdAt"), limit(25));
  const [rooms] = useCollectionData(q, { idField: "id" });

  const createNewRoom = async () => {
    const player1Name = prompt("What is your name?") || "";

    if (auth.currentUser && player1Name !== "") {
      const { id } = await addDoc(collection(db, "rooms"), {
        player1: {
          id: auth.currentUser.uid,
          name: player1Name,
        },
        player2: {
          id: null,
          name: null,
        },
        createdAt: Math.round(new Date().getTime() / 1000),
        board: JSON.stringify([
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ]),
        player1Turn: true,
      });
      props.handleSetRoomId(id);
    }
  };

  const joinRoom = async () => {
    const roomId = prompt("Please enter a Room ID") || "";
    const player2Name = prompt("What is your name?") || "";

    try {
      const roomRef = doc(db, "rooms", `${roomId}`);
      const snap = await getDoc(roomRef);

      if (snap.exists() && auth.currentUser) {
        const { uid } = auth.currentUser;
        await updateDoc(roomRef, {
          player2: {
            id: uid,
            name: player2Name,
          },
        });
        props.handleSetRoomId(roomId);
      }
      console.log("You made it to joining a room", roomId);
    } catch (error) {
      alert("No such room! Please eneter a valid Room ID");
    }
  };

  return (
    <>
      <section className="ButtonGroup">
        <button className="LobbyButton" onClick={createNewRoom}>
          Create New Room
        </button>
        <button className="LobbyButton" onClick={joinRoom}>
          Join Room
        </button>
      </section>
      {/* {rooms?.map((room) => (
        <ul key={room.id}>
          <li>Room Id: {room.id}</li>
          <li>Player 1 Id: {room.player1.id}</li>
          <li>Player 1 Name: {room.player1.name}</li>
          <li>Player 2 Id: {room.player2.id}</li>
          <li>Player 2 Name: {room.player2.name}</li>
          <li>Created At: {room.createdAt}</li>
          <li>Room Board: {room.board}</li>
        </ul>
      ))} */}
    </>
  );
}
