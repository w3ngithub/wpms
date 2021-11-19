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
        data.push({ id: doc.id, data: doc.data() });
      });

      return data;
    });

export const getUsersFromFeatureBoards = (field, name) =>
  fireStore
    .collection("boards")
    .where(field, "array-contains", name)
    .get()
    .then((querySnapshot) => {
      let data = [];
      querySnapshot.forEach((doc) => {
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

export const createBoard = (title, username, boardColor) =>
  fireStore.collection("boards").add({ title, user: username, boardColor });

export const removeBoard = (boardId) =>
  fireStore.collection("boards").doc(boardId).delete();

export const addNewMemberToBoard = (id, member) =>
  fireStore
    .collection("boards")
    .doc(id)
    .update({ members: firebase.firestore.FieldValue.arrayUnion(member) });

export const addFavouriteBoard = (id, user) =>
  fireStore
    .collection("boards")
    .doc(id)
    .update({ favourite: firebase.firestore.FieldValue.arrayUnion(user) });

export const addNewLabelsToBoard = (id, label) =>
  fireStore
    .collection("boards")
    .doc(id)
    .update({ labels: firebase.firestore.FieldValue.arrayUnion(label) });
