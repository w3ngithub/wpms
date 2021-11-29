import { fireStore } from "../firebase/config";

export const getUserFromEmail = (email) =>
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

export const getUserFromUsername = (username) =>
  fireStore
    .collection("users")
    .where("username", "==", username)
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
    firstname: userDetail.firstname.value,
    lastname: userDetail.lastname.value,
  });

export const setUserFormSocialSignUp = (user) =>
  fireStore.collection("users").add(user);
