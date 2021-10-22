// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, setPersistence, inMemoryPersistence } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, collection, doc, getDocs, query, orderBy, updateDoc, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHExhBICb909d7nRAb9R3Ce0HtZNNZGrw",
  authDomain: "notes-hermannkabi.firebaseapp.com",
  projectId: "notes-hermannkabi",
  storageBucket: "notes-hermannkabi.appspot.com",
  messagingSenderId: "293200248021",
  appId: "1:293200248021:web:3b41f389538c9bdafa365c",
  measurementId: "G-WMFNHHER6G"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

var auth = getAuth();
const db = getFirestore();

export async function checkForLogin(){
  const app = initializeApp(firebaseConfig);
  var auth = getAuth();
  await new Promise(resolve => setTimeout(resolve, 1000));
  return auth.currentUser;
}

export async function logOut(){
  var auth = getAuth();
  signOut(auth).then(() => {
    console.log("Signed out!");
    return true;
  });
}

export async function getNotes(){
  var returnArray = Array();
  var user = await checkForLogin();
  if(user != null){
    var querySnapshot = await getDocs(query(collection(db, "users", user.uid, "notes"), orderBy("ts", "desc")));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      var data = doc.data();
      data.docName = doc.id;
      returnArray.push(data);
    });
    return returnArray;
  }else{
    console.log("not logged in!");
  }
}

export async function updateNote(docName, data){
  await updateDoc(doc(db, "users", auth.currentUser.uid,"notes", docName), {
    note:data,
  });
  return true;
}

export async function deleteFile(docName){
  await deleteDoc(doc(db, "users", auth.currentUser.uid, "notes", docName));
}
export async function addNote(title){
  await addDoc(collection(db, "users",auth.currentUser.uid, "notes"), {
    title:title,
    note:'<font size="6">'+title+'</font>',
    ts:Date.now(),
  });
  return true;
}

export async function logOutUser(){
  await signOut(auth);
  return true;
}

$(".login.submit").click(function (){
  const email = $(".email").val();
  const password = $(".pwd").val();
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    auth = getAuth();
    setPersistence(auth, inMemoryPersistence).then(()=>{
      console.log("Persisted");
    });
    console.log("Back to Index");
    window.location.replace("index.html");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    var uiMessage;
    switch(errorCode){
      case "auth/invalid-email":
        uiMessage = "Your email is invalid!";
        break;
      case "auth/user-not-found":
        uiMessage = "The user was not found!";
        break;
      case "auth/invalid-email":
        uiMessage = "Your email is invalid!";
        break;
      case "auth/wrong-password":
        uiMessage = "The password is incorrect!";
        break;
      default:
        uiMessage = "Could not authenticate." + errorMessage;
    }
    var alert = $(".alert");
    var alertMessage = $(".alert .error-text");
    alertMessage.text(uiMessage);
    alert.show(200);
    setTimeout(function (){
      alert.hide(200);
    }, 2000);

  });
});

$(".register-btn").click(function (){
  window.location.replace("/register.html");
});
