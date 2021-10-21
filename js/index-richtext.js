
//TODO Add /notes

import { checkForLogin } from "/notes/js/login.js";

function isWritingBold() {
  return document.queryCommandState('bold');
}
function isWritingItalic() {
  return document.queryCommandState('italic');
}
function isWritingUnderline() {
  return document.queryCommandState('underline');
}
function isWritingSt() {
  return document.queryCommandState('strikethrough');
}
function isWritingSize() {
  return document.queryCommandState('fontSize');
}


//Returns either null or a user, like auth.currentUser would
var user;
checkForLogin().then(val=>{
  console.log(val);
  user = val;
  if(user != null){


    $(".loading").hide(300);
    $(".notes").show();
    $(".username").text(user.displayName?? user.email);


    $(".note-content").click(function (){
      var fontSize =window.getSelection().anchorNode.parentNode.size;
      if(fontSize === "5"){
        //Normal text
        $(".h3-btn").toggleClass("toggle-active", false);
        $(".h3-btn .btn-text").toggleClass("btn-text-active", false);
        $(".h1-btn").toggleClass("toggle-active", false);
        $(".h1-btn .btn-text").toggleClass("btn-text-active", false);
        $(".p-btn").toggleClass("toggle-active", true);
        $(".p-btn .btn-text").toggleClass("btn-text-active", true);

      }else if(fontSize === "6"){
        $(".p-btn").toggleClass("toggle-active", false);
        $(".p-btn .btn-text").toggleClass("btn-text-active", false);
        $(".h1-btn").toggleClass("toggle-active", false);
        $(".h1-btn .btn-text").toggleClass("btn-text-active", false);
        $(".h3-btn").toggleClass("toggle-active", true);
        $(".h3-btn .btn-text").toggleClass("btn-text-active", true);

      }else if(fontSize === "7" || typeof fontSize === "undefined"){
        $(".p-btn").toggleClass("toggle-active", false);
        $(".p-btn .btn-text").toggleClass("btn-text-active", false);
        $(".h3-btn").toggleClass("toggle-active", false);
        $(".h3-btn .btn-text").toggleClass("btn-text-active", false);
        $(".h1-btn").toggleClass("toggle-active", true);
        $(".h1-btn .btn-text").toggleClass("btn-text-active", true);
        document.execCommand("fontSize", isWritingSize(), "7");

      }
    });

    // Needed for toggling button visuals
    $(".rich-text-editor").click(function (){

      $(".bold-btn").toggleClass("toggle-active", isWritingBold());
      $(".bold-btn .btn-text").toggleClass("btn-text-active", isWritingBold());

      $(".italic-btn").toggleClass("toggle-active", isWritingItalic());
      $(".italic-btn .btn-text").toggleClass("btn-text-active", isWritingItalic());

      $(".underline-btn").toggleClass("toggle-active", isWritingUnderline());
      $(".underline-btn .btn-text").toggleClass("btn-text-active", isWritingUnderline());

      $(".st-btn").toggleClass("toggle-active", isWritingSt());
      $(".st-btn .btn-text").toggleClass("btn-text-active", isWritingSt());


    });
    $(".toggle-btn").mousedown(function (e){
      e.preventDefault();
    });


    //The click actions
    $(".bold-btn").click(function (){
      document.execCommand("bold", isWritingBold());
    });
    $(".italic-btn").click(function (){
      document.execCommand("italic", isWritingItalic());
    });
    $(".underline-btn").click(function (){
      document.execCommand("underline", isWritingUnderline());
    });
    $(".st-btn").click(function (){
      document.execCommand("strikethrough", isWritingUnderline());
    });



    //Make UI work
    $(".p-btn").click(function (){
      $(".h3-btn").toggleClass("toggle-active", false);
      $(".h3-btn .btn-text").toggleClass("btn-text-active", false);
      $(".h1-btn").toggleClass("toggle-active", false);
      $(".h1-btn .btn-text").toggleClass("btn-text-active", false);
      $(".p-btn").toggleClass("toggle-active", true);
      $(".p-btn .btn-text").toggleClass("btn-text-active", true);
      document.execCommand("fontSize", isWritingSize(), "5");

    });
    $(".h1-btn").click(function (){
      $(".p-btn").toggleClass("toggle-active", false);
      $(".p-btn .btn-text").toggleClass("btn-text-active", false);
      $(".h3-btn").toggleClass("toggle-active", false);
      $(".h3-btn .btn-text").toggleClass("btn-text-active", false);
      $(".h1-btn").toggleClass("toggle-active", true);
      $(".h1-btn .btn-text").toggleClass("btn-text-active", true);
      document.execCommand("fontSize", isWritingSize(), "7");
    });
    $(".h3-btn").click(function (){
      $(".p-btn").toggleClass("toggle-active", false);
      $(".p-btn .btn-text").toggleClass("btn-text-active", false);
      $(".h1-btn").toggleClass("toggle-active", false);
      $(".h1-btn .btn-text").toggleClass("btn-text-active", false);
      $(".h3-btn").toggleClass("toggle-active", true);
      $(".h3-btn .btn-text").toggleClass("btn-text-active", true);
      document.execCommand("fontSize", isWritingSize(), "6");
    });
    console.log(isWritingSize());

  }else{
    console.log(user);
    window.location.replace("login.html");
  }
});
