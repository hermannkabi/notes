//jshint esversion:8

//!!!IMPORTANT!!!
//This file is called main.js in the dist folder


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore/lite';


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEqlpUMk4q9rBW5g7zUBPoTLUHIo96F9c",
  authDomain: "hermann-notes.firebaseapp.com",
  projectId: "hermann-notes",
  storageBucket: "hermann-notes.appspot.com",
  messagingSenderId: "7824321145",
  appId: "1:7824321145:web:0468fbb30bb725ed3542a8",
  measurementId: "G-QV5RZGBN4M"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

var uid;
var globalUser;
var isToggledToRaw = false;

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}
function onNoteClick(){
  //Don't activate when user clicks on currently active note
  if($(this).hasClass("active")){
    return;
  }
  //Get the note id (attr note)
  //Set everything unactive (and their delete texts)
  //Set current note active
  $(".note-title").removeClass("active");
  $(".delete").hide();
  $(this).addClass("active");
  const id = $(this).attr("note");
  $("."+id).show();
  loadActiveNote();
}

async function onDeleteClick(){
  const id = $(this).attr("note");

  if($(this).text() === "Delete"){
    $(this).text("Confirm delete?");
    return;
  }else if ($(this).text()==="Confirm delete?"){
    await deleteDoc(doc(db, "notes", uid, "notes", id));
    await loadData(globalUser);
  }
}


//Put this method at the top, otherwise uid will be undefined
//I love this callback 🖤
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    uid = user.uid;
    globalUser = user;
    console.log(uid);
    var data = await loadData(user);
    // TODO
    //This has to be here, or uid will be undefined. 
    //Called initally, and when the active note is changed
    loadActiveNote();
  } else {
    // User is signed out
    // Redirect to login screen
    console.log("Not logged in!");
    window.location.href = "login";
  }
});


$("#editor-div").focus(function (){
  console.log("Here");
  console.log($("#editor-div").text());
  if($("#editor-div").text() === "Start writing your note..."){
    
    $("#editor-div").text("");
  }
});

$("#editor-div").focusout(function (){
  if($("#editor-div").text() === ""){
    
    $("#editor-div").text("Start writing your note...");
  }
});





$("#collapse").click(function (){
  $(".side-drawer").toggle(200);
  $("#appear").toggle(200);
  $("#editor-div").css("margin", "100px 50px 50px 35px");
  $("#save").css("margin", "10px 50px 10px 35px");
});

$("#appear").click(function (){
  $(".side-drawer").toggle(200);
  $("#appear").toggle(200);
  $("#save").css("margin", "");

  $("#save").css("margin-left", "450px");

  $("#editor-div").css("margin", "50px 50px 50px 450px");
});

$("#toggleRaw").click(function (){
  if(isToggledToRaw){
    //It is already raw, toggle to real HTML
    loadActiveNote({raw:false});
  }else{
    //Toggle to raw
    loadActiveNote({raw:true});

  }
  //Change the boolean
  isToggledToRaw = !isToggledToRaw;
});

$("#logout").click(function (){
  signOut(auth);
});

$("#new-note-btn").click(async function (){
  const title = $("#create-note-input").val();
  //10exp26 different codes - enough
  const id = makeid(15);
  const docRef = doc(db, "notes", uid, "notes", id);
  await setDoc(docRef, {
    id:id, 
    title:title,
    note:"Start writing your note...",
  });
  //Remove active class from everything
  $(".active").removeClass("active");
  //If all is good, create a note-title h1
  const template = `<h1 class="note-title active" note="`+id+`">`+title+`</h1>`;
  const deleteText = `<p note="`+id+`" style="color: rgb(192, 71, 71); cursor:pointer" class="title delete `+id+`" hidden>Delete</p>`;
  
  const hr = `<hr class="note-hr">`;

  $(".note-titles").append(template).append(deleteText).append(hr);
  $(".note-title").click(onNoteClick);
  $(".delete").click(onDeleteClick);

  //Clear the input
  $("#create-note-input").val("");

  
  //The template already has an active class so nothing more has to be done than to call the loadactivenote()
  loadActiveNote();
});



async function loadData(user){
  $("#username").text(user.email);

  if(user.displayName.length>0){
    //There is a username
    $("#username").text(user.displayName);
    $("p>#username").attr("title", user.email);

  }

  //Get the note titles
  const collRef = collection(db, "notes", uid, "notes");
  const docsSnap = await getDocs(collRef);
  //Empty note-titles in case its populated
  $(".note-titles").empty();
  docsSnap.forEach((doc)=>{
    const id = doc.data().id;
    const title = doc.data().title;

    const template = `<h1 class="note-title" note="`+id+`">`+title+`</h1>`;
    const deleteText = `<p note="`+id+`" style="color: rgb(192, 71, 71); cursor:pointer" class="title delete `+id+`" hidden>Delete</p>`;
    const hr = `<hr class="note-hr">`;
    $(".note-titles").append(template).append(deleteText).append(hr);

  });
  $(".note-title").click(onNoteClick);
  $(".delete").click(onDeleteClick);

  
  $(".loading").hide();
  $(".notes-div").show();
  return "Here";
}



$("#save").click(async function(){
  var noteTitle = $(".active")[0].textContent;
  var noteID  = $(".active")[0].getAttribute("note");
  var note = $("#editor-div").html();

  //Add to firebase, if the doc exists, update


  //1. Check if doc exists
  var path = doc(db, "notes/"+uid+"/notes/"+noteID);

  const docSnap = await getDoc(path);


  if(docSnap.exists()){
    await updateDoc(path, {
      note: note,
    });
  }else{
    await setDoc(path, {
      id: noteID,
      title: noteTitle,
      note: note
    });
  }
  //Refresh the note page (renders HTML)
  loadActiveNote();

  //Everything is ok
  $("#save").text("Saved!");
  setTimeout(function(){
    $("#save").text("Save note");
  }, 1000);
});


async function loadActiveNote(options){
  //Get the first active note's text
  const id = $(".active")[0].getAttribute("note");
  //Create the db request
  var docRef = doc(db, "notes", uid, "notes", id);
  //Request the document, it should exists, but better to check
  var docSnap = await getDoc(docRef);
  //If the doc does NOT exist, do nothing
  if(docSnap.exists()){
    //As string
    var content = docSnap.data().note;
    //If one wrote HTML, the <> chars would have been encoded as text
    //Rather than a fancy solution, I'm brute forcing
    //Replacing the codes with <>
    //Then checking for <(/)script>, which isn't allowed
    // &lt; = left tag
    // &gt; = right tag

    content = content.replaceAll("&lt;", "<");
    content = content.replaceAll("&gt;", ">");
    content = content.replaceAll("<script>", "SCRIPT");
    content = content.replaceAll("</script>", "SCRIPT_END");


    //As HTML
    var htmlDoc = $.parseHTML(content);


    var render = htmlDoc;

    if(options != undefined && options.raw === true){
      //Toggle to raw
      render = content;
      //Sets the content
    $("#editor-div").text(render);
    }else{
      //Sets the content
      $("#editor-div").html(render);
    }


    


    console.log(render);
    
  }

}


//This function creates the logic of changing the active note
$(".note-title").click(onNoteClick);