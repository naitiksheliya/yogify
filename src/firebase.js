import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgWKOpAbh8cYztHBqUXbninZ2OABc_S18",
  authDomain: "yogify-256a2.firebaseapp.com",
  databaseURL: "https://yogify-256a2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "yogify-256a2",
  storageBucket: "yogify-256a2.appspot.com",
  messagingSenderId: "99753073821",
  appId: "1:99753073821:web:21bf9a26ea1e8f2561c874",
  measurementId: "G-SSK5ZRZTR6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
