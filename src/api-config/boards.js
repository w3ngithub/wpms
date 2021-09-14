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

export const getSingleBoard = (id) =>
  fireStore
    .collection("boards")
    .doc(id)
    .get()
    .then((doc) => {
      return doc.data();
    });

export const updateBoard = (id, field, updatedData) =>
  fireStore
    .collection("boards")
    .doc(id)
    .update({ [field]: updatedData });

export const createBoard = (title, username) =>
  fireStore.collection("boards").add({ title, user: username });
