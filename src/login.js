//jshint esversion:8

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword,sendPasswordResetEmail,
  createUserWithEmailAndPassword, updateProfile
} from 'firebase/auth';

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

onAuthStateChanged(auth, (user)=>{
  if(user){
    //Logged in
    //Redirect back to home page (notes page)
    window.location.href = "/";
  }
});

$("#submit").click(function (){
   const email = $("#email").val();
   const pwd= $("#pwd").val();

   //Clear the error message
   $(".error-msg").text("");
   

   //Try to sign in
   signInWithEmailAndPassword(auth, email, pwd).then((userCredential)=>{
      console.log(userCredential.user);
   })

   //Cath errors
   .catch((e)=>{
     //Create an error message
     var message;
     
     //Personalize said message
     switch(e.code){
       case "auth/user-not-found":
          message = "A user with this email address was not found";
          break;
       case "auth/wrong-password":
         message = "The password for this account is incorrect";
         break;
       case "auth/invalid-email":
         message = "The email address is invalid";
         break;
       default:
         message = "Something went wrong";
     }
     //Set the HTML to the message
     $(".error-msg").text(message);
   });

});


//Forgot password section
$("#forgotpwd").click(function(){
  //In case the sign up div is open
  $(".signup-div").hide();

  $(".forgot-div").show();
  if($("#email").val().length > 0){
    //Copy the email from the input to forgot password input
    //For convinience

    $("#forgot-input").val($("#email").val());
  }
  $("#forgot-submit").click(function (){
    var emailAddress = $("#forgot-input").val();
    if(emailAddress.length > 0){
      //Catch not to send an error message to the console
      sendPasswordResetEmail(auth, emailAddress).catch((e)=>{});
      $(".forgot-form").hide();
      $(".forgot-text").show();
    }
  });
});

//Sign up logic
$("#signup").click(function(){
  //In case the forgot pwd div is open
  $(".forgot-div").hide();

  $(".signup-div").show();

  //Listen to submit btn's click
  $("#signup-submit").click(function (){
    var error;

    const name = $("#signup-input-name").val();
    const email = $("#signup-input-email").val();

    const password = $("#signup-input-pwd").val();
    const passwordRepeated = $("#signup-input-pwd-rep").val();

    console.log(email);
    
    if(password == passwordRepeated){
      if(name.length == 0 || email.length == 0 || password.length == 0){
        $(".error-msg-signup").text("All fields are required");
      }
      console.log("here");
      createUserWithEmailAndPassword(auth, email, password).then((uc)=>{
        updateProfile(auth.currentUser, {
          displayName: name,
        });
        $(".signup-text").show();
      }).catch((e)=>{
        console.log(e);
        var errorMsg;
        switch(e.code){
          case "auth/email-already-in-use":
             errorMsg = "A user with that email already exists";
             break;
          default:
            errorMsg = "Something went wrong";
        }
        $(".error-msg-signup").text(errorMsg);
        
      });
    }else{
      error = "Passwords do not match";
      $(".error-msg-signup").text(error);
    }
   
    

  });
});