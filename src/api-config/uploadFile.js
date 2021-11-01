import { firebaseStore } from "../firebase/config";

const storageRef = firebaseStore.ref();

export const uploadFile = (file) => {
  return storageRef.child(file.name).put(file);
};
