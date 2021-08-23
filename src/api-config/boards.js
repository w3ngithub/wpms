import { fireStore } from "../firebase/config";

export const getSingleBoard = (userName) =>
  fireStore
    .collection("boards")
    .where("user", "==", userName)
    .get()
    .then((querySnapshot) => {
      let data = null;
      querySnapshot.forEach((doc) => {
        data = { id: doc.id, data: doc.data() };
      });

      return data;
    });

export const updateBoard = (id, updatedData) =>
  fireStore.collection("boards").doc(id).update({ lanes: updatedData.lanes });
