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

export const setUser = (userDetail) =>
  fireStore.collection("users").add({
    email: userDetail.email.value,
    password: userDetail.password.value,
    username: userDetail.username.value,
  });

export const setUserFormGoogleSignUp = (user) =>
  fireStore.collection("users").add({ email: user.email, username: user.name });
