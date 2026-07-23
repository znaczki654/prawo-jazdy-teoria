// =========================
// GLOBALNY STAN APLIKACJI
// =========================


// pytania z Excela

let questions = [];


// pytania w aktualnym egzaminie

let examQuestions = [];


// aktualne pytanie

let currentQuestion = 0;



// odpowiedzi użytkownika

let userAnswers = {};




// =========================
// TIMERY
// =========================


// czas całego egzaminu

let examTime = 25 * 60;


let examTimerInterval;



// czas pojedynczego pytania

let questionTimerInterval;


let questionTime = 0;




// aktualna faza pytania

let currentPhase = "";





// =========================
// START APLIKACJI
// =========================


document.addEventListener(
"DOMContentLoaded",
()=>{


    initApp();


});






function initApp(){



    console.log(
        "Aplikacja uruchomiona"
    );



    showMenu();



}