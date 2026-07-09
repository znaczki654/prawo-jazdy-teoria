let questions = [];
let examQuestions = [];

let currentQuestion = 0;

let userAnswers = {};

let examTime = 25 * 60;
let examTimerInterval;

let questionTimerInterval;

let questionTime = 0;

let currentPhase = "";

let examHistory = [];

let currentExamResult = [];





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
// MENU WIDOK
// =========================


function showMenu(){


hideAll();


document
.getElementById("menuScreen")
.style.display="block";


}





function hideAll(){


document
.querySelectorAll(".container > div")
.forEach(x=>{

    x.style.display="none";

});


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
// TWORZENIE TESTU
// =========================


function createExam(){


let categoryB =

questions.filter(q=>

String(q["Kategorie"])
.includes("B")

);



let basic =

categoryB.filter(q=>

q["Zakres struktury"]
==="PODSTAWOWY"

);



let specialist =

categoryB.filter(q=>

q["Zakres struktury"]
==="SPECJALISTYCZNY"

);




examQuestions=[


...shuffle(basic).slice(0,20),


...shuffle(specialist).slice(0,12)


];



startExam();



}




function shuffle(arr){


return arr
.sort(
()=>Math.random()-0.5
);


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


startExamTimer();


showQuestion();


}







// =========================
// TIMER CAŁOŚCI
// =========================


function startExamTimer(){


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

m+":"+
String(s)
.padStart(2,"0");



if(examTime<=0)
finishExam();


},1000);



}








// =========================
// PYTANIE
// =========================



function hideMedia(){

    let box =
    document.getElementById("mediaBox");

    box.innerHTML = "";

}

function showQuestion(){


clearInterval(questionTimerInterval);



let q =
examQuestions[currentQuestion];



document
.getElementById("counter")
.innerHTML =

`${currentQuestion+1}/${examQuestions.length}`;



document
.getElementById("question")
.innerHTML =
q["Pytanie"];



// zawsze chowamy multimedia na wejściu
hideMedia();


// ukrywamy przycisk START
document
.getElementById("startMediaButton")
.style.display="none";



createAnswers(q);



// SPECJALISTYCZNE
if(
q["Zakres struktury"]
==="SPECJALISTYCZNY"
){

    startSpecialist(q);

}


// PODSTAWOWE
else{

    startBasic(q);

}


}








// =========================
// PODSTAWOWE
// =========================


function startBasic(q){

    clearInterval(questionTimerInterval);

    currentPhase = "czytanie";


    // ukrywamy multimedia na początku
    document
    .getElementById("mediaBox")
    .innerHTML = "";


    document
    .getElementById("phaseInfo")
    .innerHTML =
    "Zapoznanie z pytaniem: 20 sekund";


    document
    .getElementById("startMediaButton")
    .style.display = "block";


    let started = false;



    document
    .getElementById("startMediaButton")
    .onclick = ()=>{


        if(!started){

            started = true;


            // pokazujemy multimedia po kliknięciu START
            showMedia(q);


            startAnswerTime(q);

        }

    };



    questionTime = 20;



    runTimer(()=>{


        if(!started){

            started = true;


            // po 20 sekundach automatycznie pokazujemy multimedia
            showMedia(q);


            startAnswerTime(q);

        }


    });

}






function startAnswerTime(q){


document
.getElementById("startMediaButton")
.style.display="none";



document
.getElementById("phaseInfo")
.innerHTML =

"Czas na odpowiedź: 15 sekund";



showMedia(q);



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
.getElementById("phaseInfo")
.innerHTML =

"Multimedia i odpowiedź: 50 sekund";



showMedia(q);



questionTime=50;



runTimer(()=>{


nextQuestion();


});


}







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


box.innerHTML += `


<label class="answer">


<input type="radio"
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



let file = q["Media"].replace(/\.wmv$/i, ".mp4");



let path =
"https://janek925.synology.me/media/" + file;




if(
file.match(/\.(jpg|jpeg|png)$/i)
){


box.innerHTML =

`

<img src="${path}">

`;



}



else if(
file.match(/\.(mp4)$/i)
){


box.innerHTML =


`

<video id="videoPlayer"
controls
autoplay>

<source src="${path}">

</video>

`;



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

document.querySelector(
'input[name="answer"]:checked'
);



if(selected)

userAnswers[currentQuestion]
=
selected.value;


else

userAnswers[currentQuestion]
=
null;





currentQuestion++;





if(
currentQuestion >=
examQuestions.length
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



let good =
user &&
user==correct;



if(good)

points +=
Number(q["Liczba punktów"]) || 0;




result.push({

lp:index+1,

numer:q["Numer pytania"],

pytanie:q["Pytanie"],

media:q["Media"],

user:user,

correct:correct,

points:
Number(q["Liczba punktów"]) || 0,

category:q["Kategorie"],

structure:q["Zakres struktury"]

});



});





saveExam(result,points);



showResult(result,points);



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



box.innerHTML =


`

<div class="score">

Zdobyte punkty:
${points}

</div>

`;





result.forEach(q=>{


let cls;



if(q.user===null)

cls="empty";


else if(q.user==q.correct)

cls="correct";


else

cls="wrong";




box.innerHTML +=

`

<div class="result-item ${cls}">


<b>
Pytanie ${q.lp}
</b>


<br>

${q.pytanie}


<br><br>


Twoja odpowiedź:
${q.user ?? "brak"}


<br>


Poprawna:
${q.correct}


<br>


Punkty:
${q.points}


</div>


`;



});



}








// =========================
// LOCAL STORAGE
// =========================


function saveExam(result,points){


let history =

JSON.parse(
localStorage.getItem(
"egzaminy"
)
)
||
[];




let number =
history.length+1;



let date =
new Date()
.toLocaleString(
"pl-PL"
);





let exam={


name:

"Egzamin "
+
String(number)
.padStart(2,"0"),


date:date,


points:points,


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
localStorage.getItem(
"egzaminy"
)
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

Punkty:
${exam.points}


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
localStorage.getItem(
"egzaminy"
)
);



let exam =
history[index];



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


else if(q.user==q.correct)

cls="correct";


else

cls="wrong";





let media="";



if(q.media){


let path =
"https://janek925.synology.me/media/" +
q.media.replace(/\.wmv$/i, ".mp4");



if(
q.media.match(
/\.(jpg|jpeg|png)$/i
)
)


media=

`

<div class="review-media">

<img src="${path}">

</div>

`;



else if(
q.media.match(
/\.(mp4|wmv)$/i
)
)


media=

`

<div class="review-media">

<video controls>

<source src="${path}">

</video>

</div>

`;



}







box.innerHTML +=



`

<div class="review-item ${cls}">


<h3>
Pytanie ${q.lp}
</h3>


<p>
${q.pytanie}
</p>


${media}


<p>
Twoja odpowiedź:
${q.user ?? "brak"}

</p>


<p>
Poprawna:
${q.correct}

</p>


</div>


`;



});



}






document
.getElementById("backHistoryButton")
.onclick = showHistory;