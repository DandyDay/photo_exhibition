const photoList = document.getElementById("photo_list");  //사진을 추가할 ul
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const captionLabel = document.getElementById("photo_info");

const PHOTO_SIZE = 600;

const ACCESS_TOKEN = "IGQVJYMFRRZAHh5VjFramtDcm1XUk5QMlFCSVNHQWwtNUthbm5XT1RhUmhlVElzbGwyellnbGw1dXloUW5FMXJtNnpJVm53d2g3SjFDNjNMNGNTSlhMUk9YZAFhKTGZATMWlUeDlZATk1n";

const MOVENEXT = 1;
const MOVEPREV = 0;

var photo_num = 0;            //로드된 사진의 갯수
var current_photo_idx = 0;    //현재 디스플레이중인 사진의 인덱스 GLOBAL    
let photo_src_list = [];      //[IMAGE URL, CAPTION, TIME]을 아이템으로 가지는 array

photo_src_list = [["images/1.jpg"],["images/2.jpg"],["images/3.jpg"],["images/4.jpg"],["images/5.jpg"]];

function addPhoto(image_src){
  const li = document.createElement("li");
  li.id = "photo" + photo_num;
  var newImage = new Image(PHOTO_SIZE,PHOTO_SIZE);
  newImage.src = image_src;
  li.appendChild(newImage);
  photoList.appendChild(li);
  photo_num += 1;
}

function movePhoto(direction, photo_list){
  if(direction == MOVENEXT){
    if(parseInt(photo_list.style.right) != PHOTO_SIZE * (photo_num-1))
    photo_list.style.right = parseInt(photo_list.style.right) + PHOTO_SIZE + 'px';
    
  }else if(direction == MOVEPREV){
    if(parseInt(photo_list.style.right) != 0)
    photo_list.style.right = parseInt(photo_list.style.right) - PHOTO_SIZE + 'px';
  }
}

function loadPhotos(){   
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  fetch(
    `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,username,timestamp&access_token=${ACCESS_TOKEN}`, requestOptions
  ).then(function(response){
    return response.json()
  }).then(function(json){
    for(let i=0;i<json.data.length;i++){
      var caption = json.data[i].caption;
      var time = json.data[i].timestamp;
      if(json.data[i].media_type == 'IMAGE'){
        var imgsrc = json.data[i].media_url;
        addPhoto(imgsrc);
        console.log(imgsrc);
        photo_src_list.push([imgsrc,caption,time]);
      } else if (json.data[i].media_type == 'CAROUSEL_ALBUM'){
        var ID = json.data[i].id;
        fetch(
          `https://graph.instagram.com/${ID}/children?fields=media_url,media_type&access_token=${ACCESS_TOKEN}`,requestOptions
        ).then(function(response_child){
          return response_child.json();
        }).then(function(json_child){
          for(let j=0;j<json_child.data.length;j++){
            if(json_child.data[j].media_type == "IMAGE") {
              var imgsrc = json_child.data[j].media_url;
              addPhoto(imgsrc);
              photo_src_list.push([imgsrc,caption,time]);
            }
          }
        });
      }
    }
  });
}

function init(){
  photo_list.style.position = 'relative';
  photo_list.style.right = '0px';

  // addPhoto("images/1.jpg");
  // addPhoto("images/2.jpg");
  // addPhoto("images/3.jpg");
  loadPhotos();

  nextBtn.addEventListener("click", function(){
    movePhoto(MOVENEXT, photoList);
  });

  prevBtn.addEventListener("click", function(){
    movePhoto(MOVEPREV, photoList);
  });
}

init();

