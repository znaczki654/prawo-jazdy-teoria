function showMedia(q){



let box =
document.getElementById("mediaBox");



box.innerHTML="";



if(!q["Media"])
return;


let file =

q["Media"]
.replace(/\.wmv$/i,".mp4");





let path =

"https://janek925.synology.me/media/"
+
file;






if(
file.match(/\.(jpg|jpeg|png)$/i)

){


box.innerHTML =


`
<img 
src="${path}"
class="media-image">

`;



}





else if(
file.match(/\.mp4$/i)

){


box.innerHTML =


`
<video
id="videoPlayer"
autoplay
playsinline
controlsList="nodownload noplaybackrate nofullscreen">

<source
src="${path}"
type="video/mp4">

</video>

`;



let video =
document.getElementById("videoPlayer");



if(video){

video.controls=false;

}

}


}


function hideMedia(){


let box =
document.getElementById("mediaBox");


if(box){

box.innerHTML="";

}


}





function showQuestion(){



clearInterval(questionTimerInterval);


let q =
examQuestions[currentQuestion];

document
.getElementById("questionId")
.innerHTML =
"ID: " + q["Numer pytania"];

document
.getElementById("counter")
.innerHTML =

`${currentQuestion+1}/${examQuestions.length}`;




document
.getElementById("question")
.innerHTML =

q["Pytanie"];




hideMedia();



document
.getElementById("startMediaButton")
.style.display="none";



createAnswers(q);





if(
q["Zakres struktury"]
==="SPECJALISTYCZNY"

){

startSpecialist(q);


}

else{


startBasic(q);


}



}


function showHistoryMedia(button, file){

    if(!file)
        return;

    let box = button.nextElementSibling;

    if(box.innerHTML !== ""){
        box.innerHTML = "";
        button.innerHTML = "Pokaż multimedia";
        return;
    }

    file = file.replace(/\.wmv$/i, ".mp4");

    let path =
    "https://janek925.synology.me/media/" + file;

    if(file.match(/\.(jpg|jpeg|png)$/i)){

        box.innerHTML =
        `<div class="review-media">

        <img src="${path}">

        </div>`;

    }
    else if(file.match(/\.mp4$/i)){

        box.innerHTML =
        `<div class="review-media">

        <video controls>

        <source src="${path}" type="video/mp4">

        </video>

        </div>
        `;
    }

    button.innerHTML = "Ukryj multimedia";
}



// =========================
// TŁUMACZENIE ODPOWIEDZI
// =========================


function translateAnswer(value){


if(value==="T")

return "TAK";



if(value==="N")

return "NIE";



return value ?? "brak";


}