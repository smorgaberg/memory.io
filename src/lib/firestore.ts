import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export const saveUserToFirestore = async (
  uid: string,
  name: string,
  email: string
) => {
  await setDoc(doc(db, "users", uid), {
    name,
    email,
  });
};
