// =========================
// GLOBALNY STAN APLIKACJI
// =========================


let questions = [];

let examQuestions = [];

let currentQuestion = 0;

let userAnswers = {};



let examTime = 25 * 60;

let examTimerInterval;


let questionTimerInterval;


let questionTime = 0;


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


    setupMenu();


    showMenu();


}






// =========================
// MENU
// =========================


function setupMenu(){



    document
    .getElementById("startButton")
    .onclick = ()=>{


        loadExcel();


    };





    document
    .getElementById("historyButton")
    .onclick = ()=>{


        showHistory();


    };






    document
    .getElementById("backMenuButton")
    .onclick = ()=>{


        showMenu();


    };






    document
    .getElementById("backAfterResult")
    .onclick = ()=>{


        showMenu();


    };






    document
    .getElementById("backHistoryButton")
    .onclick = ()=>{


        showHistory();


    };


}







// =========================
// POKAZYWANIE EKRANÓW
// =========================


function hideAll(){



    document
    .querySelectorAll(".container > div")
    .forEach(x=>{


        x.style.display="none";


    });


}







function showMenu(){



    hideAll();



    let menu =
    document.getElementById("menuScreen");



    if(menu){

        menu.style.display="block";

    }



    if(typeof loadVersion === "function"){

        loadVersion();

    }


}


// =========================
// BLOKADA PRAWEGO KLIKU
// PODCZAS EGZAMINU
// =========================


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

document
.getElementById("difficultyButton")
.onclick = () => {

    if(questions.length === 0){

        loadExcel();

        setTimeout(
            startDifficultMode,
            1000
        );

    }
    else{

        startDifficultMode();

    }

};