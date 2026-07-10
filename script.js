let questions = [];
let examQuestions = [];

let currentQuestion = 0;

let userAnswers = {};

let examTime = 25 * 60;
let examTimerInterval;

let questionTimerInterval;

let questionTime = 0;

let currentPhase = "";

const MAX_POINTS = 74;
const PASS_POINTS = 68;

if(localStorage.getItem("darkMode")==="true"){
    document.body.classList.add("dark");
    document.getElementById("darkModeButton").innerHTML = "☀️ Tryb jasny";
}


// =========================
// WERSJA APLIKACJI
// =========================

function loadVersion(){

fetch("version.json")
.then(r => r.json())
.then(v => {

    let version =
    document.getElementById("version");

    document.getElementById("version-block").style.display = "block";

    if(version){
        version.innerHTML = v.version;
    }

});

}

loadVersion();



// =========================
// MENU
// =========================


document
.getElementById("startButton")
.onclick = () => {

    loadExcel();

};



document
.getElementById("historyButton")
.onclick = () => {

    showHistory();

};



document
.getElementById("backMenuButton")
.onclick = () => {

    showMenu();

};



document
.getElementById("backAfterResult")
.onclick = () => {

    showMenu();

};





// =========================
// MENU
// =========================


function showMenu(){

    hideAll();

    document
    .getElementById("menuScreen")
    .style.display="block";
    loadVersion();

}




function hideAll(){

    document
    .querySelectorAll(".container > div")
    .forEach(x=>{

        x.style.display="none";

    });

}





// =========================
// LOSOWANIE
// =========================


function shuffle(arr){

    return arr
    .sort(
        ()=>Math.random()-0.5
    );

}





// =========================
// EXCEL
// =========================


function loadExcel(){


fetch("baza05-2026.xlsx")


.then(r=>r.arrayBuffer())


.then(data=>{


let workbook =
XLSX.read(data);



let sheet =
workbook.Sheets[
workbook.SheetNames[0]
];



questions =
XLSX.utils.sheet_to_json(sheet);



console.log(
"Pytań:",
questions.length
);



createExam();



});


}







// =========================
// LOSOWANIE WG PUNKTÓW
// =========================


function getQuestionsByPoints(array, three, two, one){


let q3 =

shuffle(
array.filter(q =>
Number(q["Liczba punktów"]) === 3
)
)
.slice(0,three);



let q2 =

shuffle(
array.filter(q =>
Number(q["Liczba punktów"]) === 2
)
)
.slice(0,two);



let q1 =

shuffle(
array.filter(q =>
Number(q["Liczba punktów"]) === 1
)
)
.slice(0,one);



return [

...q3,
...q2,
...q1

];


}





// =========================
// TWORZENIE EGZAMINU
// =========================


function createExam(){



let categoryB =

questions.filter(q =>

String(q["Kategorie"])
.includes("B")

);





let basic =

categoryB.filter(q =>

q["Zakres struktury"]
==="PODSTAWOWY"

);





let specialist =

categoryB.filter(q =>

q["Zakres struktury"]
==="SPECJALISTYCZNY"

);






let basicQuestions =

getQuestionsByPoints(
basic,
10,
6,
4
);






let specialistQuestions =

getQuestionsByPoints(
specialist,
6,
4,
2
);





examQuestions = [

    ...shuffle(basicQuestions),

    ...shuffle(specialistQuestions)

];




console.log(
"Egzamin:",
examQuestions.length
);



console.log(
"Max punkty:",
examQuestions.reduce(
(sum,q)=>
sum+Number(q["Liczba punktów"]),
0
)
);



startExam();


}





// =========================
// START EGZAMINU
// =========================


function startExam(){


hideAll();



document
.getElementById("examScreen")
.style.display="block";



currentQuestion=0;


userAnswers={};



examTime =
25*60;



startExamTimer();


showQuestion();


}





// =========================
// TIMER EGZAMINU
// =========================


function startExamTimer(){


clearInterval(examTimerInterval);



examTimerInterval =

setInterval(()=>{


examTime--;



let m =
Math.floor(examTime/60);



let s =
examTime%60;



document
.getElementById("examTimer")
.innerHTML =

m + ":" +
String(s).padStart(2,"0");



if(examTime<=0){

finishExam();

}



},1000);



}


// =========================
// PYTANIE
// =========================


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





// =========================
// PODSTAWOWE
// =========================


function startBasic(q){


clearInterval(questionTimerInterval);



currentPhase="czytanie";



document
.getElementById("phaseInfo")
.innerHTML =

"Zapoznanie z pytaniem: 20 sekund";





let button =
document.getElementById("startMediaButton");



button.style.display="block";

document
.getElementById("nextButton")
.style.display="none";



let started=false;





button.onclick=()=>{


if(started)
return;



started=true;



showMedia(q);

document
.getElementById("nextButton")
.style.display="block";


startAnswerTime(q);



};





questionTime=20;



runTimer(()=>{



if(!started){


started=true;



showMedia(q);

document
.getElementById("nextButton")
.style.display="block";


startAnswerTime(q);



}



});



}






// =========================
// CZAS ODPOWIEDZI
// =========================


function startAnswerTime(q){


document
.getElementById("startMediaButton")
.style.display="none";



document
.getElementById("phaseInfo")
.innerHTML =

"Czas na odpowiedź: 15 sekund";



questionTime=15;



runTimer(()=>{


nextQuestion();


});

}



// =========================
// SPECJALISTYCZNE
// =========================


function startSpecialist(q){

document
.getElementById("nextButton")
.style.display="block";

document
.getElementById("phaseInfo")
.innerHTML =

"Multimedia i odpowiedź: 50 sekund";



showMedia(q);




questionTime=50;



runTimer(()=>{


nextQuestion();


});



}



// =========================
// TIMER PYTANIA
// =========================


function runTimer(callback){



clearInterval(questionTimerInterval);



updateQuestionTimer();



questionTimerInterval =

setInterval(()=>{


questionTime--;



updateQuestionTimer();



if(questionTime<=0){


clearInterval(questionTimerInterval);


callback();


}


},1000);


}


function updateQuestionTimer(){


document
.getElementById("questionTimer")
.innerHTML =

questionTime+" s";

}

// =========================
// ODPOWIEDZI
// =========================

function createAnswers(q){


let box =
document.getElementById("answers");

box.innerHTML="";


let booleanQuestion =

!q["Odpowiedź A"] &&
!q["Odpowiedź B"] &&
!q["Odpowiedź C"];

if(booleanQuestion){

createAnswer(
"TAK",
"T",
box
);

createAnswer(
"NIE",
"N",
box
);


}

else{


createAnswer(
q["Odpowiedź A"],
"A",
box
);

createAnswer(
q["Odpowiedź B"],
"B",
box
);



createAnswer(
q["Odpowiedź C"],
"C",
box
);


}


}


function createAnswer(text,value,box){


box.innerHTML +=


`
<label class="answer">

<input
type="radio"
name="answer"
value="${value}">

${text}

</label>
`;


}


// =========================
// MEDIA
// =========================


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


// =========================
// NASTĘPNE PYTANIE
// =========================


document
.getElementById("nextButton")
.onclick = nextQuestion;

function nextQuestion(){



let selected =

document
.querySelector(
'input[name="answer"]:checked'
);


if(selected){


userAnswers[currentQuestion]
=
selected.value;


}

else{


userAnswers[currentQuestion]
=
null;


}


currentQuestion++;



if(
currentQuestion >= examQuestions.length

){


finishExam();

}

else{


showQuestion();


}


}

// =========================
// KONIEC EGZAMINU
// =========================


function finishExam(){


clearInterval(examTimerInterval);

clearInterval(questionTimerInterval);


let result=[];

let points=0;



examQuestions.forEach((q,index)=>{


let user =
userAnswers[index] ?? null;



let correct =
String(q["Poprawna odp"]);




let qPoints =
Number(q["Liczba punktów"]) || 0;



if(
user &&
user===correct
){

points += qPoints;

}



result.push({

lp:index+1,

numer:q["Numer pytania"],

pytanie:q["Pytanie"],

media:q["Media"],


answerA:q["Odpowiedź A"],

answerB:q["Odpowiedź B"],

answerC:q["Odpowiedź C"],



user:user,

correct:correct,


points:qPoints,



category:q["Kategorie"],

structure:q["Zakres struktury"]


});



});





saveExam(
result,
points
);



showResult(
result,
points
);



}








// =========================
// WYNIK
// =========================


function showResult(result,points){


hideAll();



document
.getElementById("resultScreen")
.style.display="block";



let box =
document.getElementById("result");



let percent =
((points/MAX_POINTS)*100)
.toFixed(1);





let passed =
points >= PASS_POINTS;



box.innerHTML =


`
<div class="score">

<h2>
${points}/${MAX_POINTS} pkt
</h2>


<p>
Skuteczność:
${percent}%
</p>


<h2>

${
passed
?
"✅ ZDANY"
:
"❌ NIEZDANY"

}

</h2>


</div>
`;







result.forEach(q=>{


let cls;



if(q.user===null)

cls="empty";


else if(q.user===q.correct)

cls="correct";


else

cls="wrong";






box.innerHTML +=


`
<div class="result-item ${cls}">


<h3>

Pytanie ${q.lp}

<span class="question-id">

ID: ${q.numer}

</span>

</h3>


<p>
${q.pytanie}
</p>

${
q.media ?
`
<button onclick="showHistoryMedia(this,'${q.media}')">
Pokaż multimedia
</button>

<div class="history-media"></div>
`
:
""
}



<p>
Twoja odpowiedź:
${translateAnswer(q.user)}
</p>



<p>
Poprawna:
${translateAnswer(q.correct)}
</p>



${createResultAnswers(q)}



<p>
Punkty:
${q.user===q.correct ? q.points : 0}/${q.points}
</p>


</div>
`;



});



}







function createResultAnswers(q){

if(q.correct==="T" || q.correct==="N"){
    return "";
}    

let html="";



let answers=[

{
v:"A",
t:q.answerA
},

{
v:"B",
t:q.answerB
},

{
v:"C",
t:q.answerC
}

];










answers.forEach(a=>{


let icon="";



if(a.v===q.correct)

icon="✅";



if(
a.v===q.user &&
a.v!==q.correct
)

icon="❌";




html +=


`
<p>
${a.v}) ${a.t ?? ""} ${icon}
</p>
`;



});



return html;


}







// =========================
// LOCAL STORAGE
// =========================


function saveExam(result,points){



let history =

JSON.parse(
localStorage.getItem("egzaminy")
)
||
[];




let number =
history.length+1;



let exam = {


name:

"Egzamin "
+
String(number)
.padStart(2,"0"),



date:

new Date()
.toLocaleString("pl-PL"),



points:points,


maxPoints:MAX_POINTS,


percent:

((points/MAX_POINTS)*100)
.toFixed(1),



passed:

points>=PASS_POINTS,



questions:result



};




history.push(exam);



localStorage.setItem(
"egzaminy",
JSON.stringify(history)
);



}







// =========================
// HISTORIA
// =========================


function showHistory(){


hideAll();



document
.getElementById("historyScreen")
.style.display="block";



let box =
document.getElementById("historyList");



box.innerHTML="";



let history =

JSON.parse(
localStorage.getItem("egzaminy")
)
||
[];




if(history.length===0){


box.innerHTML=

"<p>Brak zapisanych egzaminów</p>";

return;

}





history.forEach((exam,index)=>{



box.innerHTML +=


`
<div class="history-item"
onclick="openExamHistory(${index})">


<b>
${exam.name}
</b>


<br>

${exam.date}


<br>


Wynik:
${exam.points}/${exam.maxPoints} pkt


<br>


Skuteczność:
${exam.percent}%


<br>


Rezultat:
${exam.passed ? "✅ ZDANY" : "❌ NIEZDANY"}



</div>

`;



});



}








// =========================
// PODGLĄD EGZAMINU
// =========================


function openExamHistory(index){



let history =

JSON.parse(
localStorage.getItem("egzaminy")
);



let exam =
history[index];



document
.getElementById("reviewTitle")
.innerHTML =

"Podgląd egzaminu " + exam.name;



hideAll();



document
.getElementById("reviewScreen")
.style.display="block";





let box =
document.getElementById("reviewContent");



box.innerHTML="";






exam.questions.forEach(q=>{


let cls;



if(q.user===null)

cls="empty";


else if(q.user===q.correct)

cls="correct";


else

cls="wrong";





box.innerHTML +=


`
<div class="review-item ${cls}">


<h3>

Pytanie ${q.lp}

<span class="question-id">

ID: ${q.numer}

</span>

</h3>



<p>
${q.pytanie}
</p>

${
q.media ?
`
<button onclick="showHistoryMedia(this,'${q.media}')">
Pokaż multimedia
</button>

<div class="history-media"></div>
`
:
""
}



<div class="answer-summary">


<p>
Twoja odpowiedź:
${translateAnswer(q.user)}

</p>



<p>
Poprawna odpowiedź:
${translateAnswer(q.correct)}

</p>



<p>
Punkty:
${q.user===q.correct ? q.points : 0}/${q.points}

</p>


</div>



${createHistoryAnswers(q)}



</div>

`;



});



}








function createHistoryAnswers(q){

if(q.correct==="T" || q.correct==="N"){
    return "";
}

let html="";



let answers=[

{
value:"A",
text:q.answerA
},

{
value:"B",
text:q.answerB
},

{
value:"C",
text:q.answerC
}

];


answers.forEach(a=>{


let icon="";



if(a.value===q.correct)

icon="✅";



if(
a.value===q.user &&
a.value!==q.correct
)

icon="❌";



html +=


`
<div class="history-answer">

${a.value}) ${a.text ?? ""} ${icon}

</div>

`;



});



return html;


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
        `<img src="${path}" class="media-image">`;

    }
    else if(file.match(/\.mp4$/i)){

        box.innerHTML =
        `
        <video controls>
            <source src="${path}" type="video/mp4">
        </video>
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








// =========================
// POWRÓT
// =========================


document
.getElementById("backHistoryButton")
.onclick =
showHistory;





// blokada menu podczas egzaminu


document.addEventListener(
"contextmenu",
function(e){


let exam =
document.getElementById("examScreen");



if(
exam &&
exam.style.display==="block"
){

e.preventDefault();

}



});

// =========================
// DARK MODE
// =========================

document
.getElementById("darkModeButton")
.onclick = ()=>{

    document.body.classList.toggle("dark");

    let dark = document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        dark
    );

    document.getElementById("darkModeButton").innerHTML =
        dark ? "☀️ Tryb jasny" : "🌙 Tryb ciemny";

};