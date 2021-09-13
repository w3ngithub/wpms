import { fireStore } from "../firebase/config";

export const getUser = (email) =>
  fireStore
    .collection("users")
    .where("email", "==", email)
    .get()
    .then((querySnapshot) => {
      let data = null;
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data = doc.data();
      });

      return data;
    });
