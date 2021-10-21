import {addNote, logOutUser} from "/notes/js/login.js";

function showIcon(success){
  var save = $(".new-btn > .new-btn-text");
  var check = $(".new-btn > .save-"+(success ? "check" : "fail"));
  save.fadeOut(0);
  check.fadeIn(300);
  setTimeout(function (){
    save.fadeIn(300);
    check.fadeOut(0);
  }, 2000);
}


//This script adds notes
$(".new-btn").click(function(){
  var title = $(".new-title").val();
  if(title.length > 0){
    try{
      addNote(title).then(()=>{

        location.reload();
      });
      showIcon(true);

    }catch(e){
      showIcon(false);
    }
  }else{
    showIcon(false);
  }
});

$(".logout-btn").click(function (){
  logOutUser().then(()=>{
    location.reload();
  });
});
