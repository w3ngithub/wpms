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

export const getSingleBoard = (id) =>
  fireStore
    .collection("boards")
    .doc(id)
    .get()
    .then((doc) => {
      console.log("singleboard", doc.data());
      return doc.data();
    });

export const updateBoard = (id, updatedData) =>
  fireStore.collection("boards").doc(id).update({ lanes: updatedData.lanes });
