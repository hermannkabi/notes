// Note selector and note getter, also sets rich text
import { getNotes, logOut, updateNote, deleteFile} from "/notes/js/login.js";
$(".save-check").hide();
$(".save-fail").hide();
$(".confirm-btn").hide();

function showIcon(success, type){
  var save = $("."+type+"-btn > .fa-"+type);
  var check = $("."+type+"-btn > .save-"+(success ? "check" : "fail"));
  save.fadeOut(300);
  check.fadeIn(300);
  setTimeout(function (){
    save.fadeIn(300);
    check.fadeOut(300);
  }, 2000);
}

async function getNoteData(){

  var list = await getNotes();
  for(var i = 0; i<list.length; i++){
    var note = list[i];
    var noteSelector = '<h2 class="note-selector" id="'+i+'">' + note.title + '</h2>';
    $(".sidebar").append(noteSelector);
  }
  $(".note-selector").click(function(){
    $(".note-selector").toggleClass("selected", false);
    this.classList.toggle("selected");
    var note = list[this.id].note;
    $(".note-content").html(note);
  });
  $(".save-btn").click(function(){
    try{
      var index = $(".selected").prop("id");
      var html = $(".note-content").html();
      updateNote(list[index].docName, html);
      showIcon(true, "save");
    }catch(e){
      showIcon(false, "save");
    }
  });
  $(".trash-alt-btn").click(function(){
    $(".confirm-btn").show(300);
  });
  $(".confirm-btn").click(function (){
    $(".confirm-btn").hide(200);

    try{
      var index = $(".selected").prop("id");

      deleteFile(list[index].docName).then(()=>{
        location.reload();
      });
      showIcon(true, "trash-alt");

    }catch(e){
      console.log(e);
      showIcon(false, "trash-alt");
    }
  });

}




getNoteData();
