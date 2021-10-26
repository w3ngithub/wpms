import firebase from "firebase/app";
import { fireStore } from "../firebase/config";

export const getUsersBoards = (name) =>
  fireStore
    .collection("boards")
    .where("user", "==", name)
    .get()
    .then((querySnapshot) => {
      let data = [];
      querySnapshot.forEach((doc) => {
        console.log("from database raw data", doc.data());
        data.push({ id: doc.id, data: doc.data() });
      });

      return data;
    });

export const getUsersInvitesBoards = (name) =>
  fireStore
    .collection("boards")
    .where("members", "array-contains", name)
    .get()
    .then((querySnapshot) => {
      let data = [];
      querySnapshot.forEach((doc) => {
        console.log("from database raw data", doc.data());
        data.push({ id: doc.id, data: doc.data() });
      });

      return data;
    });

export const getSingleBoard = (id) =>
  fireStore
    .collection("boards")
    .doc(id)
    .get()
    .then((doc) => {
      console.log("singleboard", doc.data());
      return doc.data();
    });

export const updateBoard = (id, field, updatedData) =>
  fireStore
    .collection("boards")
    .doc(id)
    .update({ [field]: updatedData });

export const createBoard = (title, username) =>
  fireStore.collection("boards").add({ title, user: username });

export const addNewMemberToBoard = (id, member) =>
  fireStore
    .collection("boards")
    .doc(id)
    .update({ members: firebase.firestore.FieldValue.arrayUnion(member) });
